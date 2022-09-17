import WebComponent from "../../lib/components/WebComponent";
import TemplateConfigurationModel from "../../data/models/TemplateConfigurationModel";
import State from "../../lib/state/State";
import UserSettingsModel, {
  Template,
} from "../../data/models/UserSettingsModel";
import html from "./TemplateConfigurator.html";
import css from "./TemplateConfigurator.css";
import TopicConfigurator from "./TopicConfigurator/TopicConfigurator";
import InputTypeConfigurator from "./InputTypeConfigurator/InputTypeConfigurator";
import DataManager from "../../data/DataManager";
import GlobalState from "../../lib/state/GlobalState";
import { GlobalStates } from "../../state/GlobalStates";

/**
 * @enum TemplateConfigurationProgress
 * The different states of the template configuration process
 */
enum TemplateConfigurationProgress {
  /**
   * The user is configuring the topics
   */
  SELECT_TOPICS,
  /**
   * The user is configuring the input types
   */
  SELECT_INPUT_TYPES,
}

/**
 * @class TemplateConfigurator
 * Component to configure the note template
 *
 * @example
 * Usage:
 * 1. create and append an instance of this component to the DOM
 *   - templateConfigurationModelState: a state containing the template configuration model
 * 2. listen for the finish event, which contains the configured template
 *  - templateConfigurator.addEventListener(
 *      TemplateConfigurator.FINISH_TEMPLATE_CONFIGURATION_EVENT,
 *      (event: AppEvent) => {...}
 *    );
 */
export default class TemplateConfigurator extends WebComponent {
  public static readonly FINISH_TEMPLATE_CONFIGURATION_EVENT =
    "onFinishTemplateConfiguration";

  private templateConfigurationModelState!: State<TemplateConfigurationModel>;
  private readonly templateToEditState: State<Template> = new State([]);

  private readonly configurationProgressState =
    new State<TemplateConfigurationProgress>(
      TemplateConfigurationProgress.SELECT_TOPICS
    );

  private $topicConfiguratorContainer!: HTMLDivElement;
  private $topicConfigurator!: TopicConfigurator;

  private $inputTypeConfiguratorContainer!: HTMLDivElement;
  private $inputTypeConfigurator!: InputTypeConfigurator;

  constructor(templateToEdit?: Template) {
    super(html, css);
    if (templateToEdit) {
      this.templateToEditState.value = templateToEdit;
    }
  }

  get htmlTagName() {
    return "template-configurator";
  }

  onCreate(): Promise<void> | void {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const templateConfigurationModel =
        await DataManager.getTemplateConfigurationModel();
      this.templateConfigurationModelState =
        templateConfigurationModel.toState();
      this.$initHtml();
      this.$initHtmlListener();
      this.initStateListener();
      resolve();
    });
  }

  $initHtml() {
    this.$initTopicConfigurator();
    this.$initInputTypeConfigurator();
  }

  $initTopicConfigurator = () => {
    this.$topicConfiguratorContainer = this.select(
      "#topic-configurator-container"
    )!;
    this.$topicConfigurator = new TopicConfigurator(
      this.templateConfigurationModelState,
      this.templateToEditState
    );
    this.$topicConfiguratorContainer.appendChild(this.$topicConfigurator);
  };

  $initInputTypeConfigurator = () => {
    this.$inputTypeConfiguratorContainer = this.select(
      "#input-type-configurator-container"
    )!;
    this.$inputTypeConfigurator = new InputTypeConfigurator(
      this.templateToEditState
    );
    this.$inputTypeConfiguratorContainer.appendChild(
      this.$inputTypeConfigurator
    );
  };

  private $initHtmlListener() {
    this.$topicConfigurator.addEventListener(
      TopicConfigurator.NEXT_BUTTON_CLICKED_EVENT,
      this.$onFinishTopicConfiguration
    );
    this.$inputTypeConfigurator.addEventListener(
      InputTypeConfigurator.BACK_BUTTON_CLICKED_EVENT,
      this.$onBackToTopicConfiguration
    );
    this.$inputTypeConfigurator.addEventListener(
      InputTypeConfigurator.NEXT_BUTTON_CLICKED_EVENT,
      this.$onFinishInputTypeConfiguration
    );
  }

  private initStateListener() {
    this.configurationProgressState.addEventListener(
      "change",
      this.$onConfigurationProgressChanged
    );
  }

  private $onConfigurationProgressChanged = () => {
    if (
      this.configurationProgressState.value ===
      TemplateConfigurationProgress.SELECT_TOPICS
    ) {
      this.$topicConfiguratorContainer.hidden = false;
      this.$inputTypeConfiguratorContainer.hidden = true;
    } else {
      this.$topicConfiguratorContainer.hidden = true;
      this.$inputTypeConfigurator.refresh();
      this.$inputTypeConfiguratorContainer.hidden = false;
    }
  };

  private $onFinishTopicConfiguration = () => {
    // user selected all topics
    this.configurationProgressState.value =
      TemplateConfigurationProgress.SELECT_INPUT_TYPES;
  };

  private $onBackToTopicConfiguration = () => {
    // user wants to go back to topic configuration
    this.configurationProgressState.value =
      TemplateConfigurationProgress.SELECT_TOPICS;
  };

  private $onFinishInputTypeConfiguration = async () => {
    // user finished input type configuration
    // -> configuration is finished
    const template = this.templateToEditState.value,
      userSettingsModelState = GlobalState.getStateById<UserSettingsModel>(
        GlobalStates.userSettingsModel
      );

    if (userSettingsModelState) {
      const userSettingsModel = userSettingsModelState.value;
      userSettingsModel.settings.template = template;
      DataManager.updateUserSettingsModel(userSettingsModel).then(() => {
        this.notifyAll(
          TemplateConfigurator.FINISH_TEMPLATE_CONFIGURATION_EVENT,
          template
        );
      });
    }
  };
}
