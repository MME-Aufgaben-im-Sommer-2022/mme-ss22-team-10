import WebComponent from "../../lib/components/WebComponent";
import TemplateConfigurationModel from "../../data/models/TemplateConfigurationModel";
import State from "../../lib/state/State";
import UserSettingsModel, {
  Template,
} from "../../data/models/UserSettingsModel";
import html from "./TemplateConfigurator.html";
import css from "./TemplateConfigurator.css";
import { BlockContentInputType } from "../../data/models/EditorModel";
import TopicConfigurator from "./TopicConfigurator/TopicConfigurator";
import InputTypeConfigurator from "./InputTypeConfigurator/InputTypeConfigurator";
import DataManager from "../../data/DataManager";
import GlobalState from "../../lib/state/GlobalState";
import { GlobalStates } from "../../state/GlobalStates";

enum TemplateConfigurationProgress {
  SELECT_TOPICS,
  SELECT_INPUT_TYPES,
}

// Component to configure the note template

// Usage:
// 1. create and append an instance of this component to the DOM
//    - templateConfigurationModelState: a state containing the template configuration model
// 2. listen for the finish event, which contains the configured template
//    - templateConfigurator.addEventListener(
//        TemplateConfigurator.FINISH_TEMPLATE_CONFIGURATION_EVENT,
//        (event: AppEvent) => {...}
//      );

export default class TemplateConfigurator extends WebComponent {
  public static readonly FINISH_TEMPLATE_CONFIGURATION_EVENT =
    "onFinishTemplateConfiguration";

  private templateConfigurationModelState!: State<TemplateConfigurationModel>;
  private readonly selectedTitlesState: State<Array<string>> = new State([]);
  private readonly selectedInputTypesState: State<
    Array<BlockContentInputType>
  > = new State([]);

  private readonly configurationProgressState: State<TemplateConfigurationProgress> =
    new State<TemplateConfigurationProgress>(
      TemplateConfigurationProgress.SELECT_TOPICS
    );

  private $topicConfiguratorContainer!: HTMLDivElement;
  private $topicConfigurator!: TopicConfigurator;

  private $inputTypeConfiguratorContainer!: HTMLDivElement;
  private $inputTypeConfigurator!: InputTypeConfigurator;

  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
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

  $initHtml(): void {
    this.$initTopicConfigurator();
    this.$initInputTypeConfigurator();
  }

  $initTopicConfigurator = (): void => {
    this.$topicConfiguratorContainer = this.select(
      "#topic-configurator-container"
    )!;
    this.$topicConfigurator = new TopicConfigurator(
      this.templateConfigurationModelState,
      this.selectedTitlesState
    );
    this.$topicConfiguratorContainer.appendChild(this.$topicConfigurator);
  };

  $initInputTypeConfigurator = (): void => {
    this.$inputTypeConfiguratorContainer = this.select(
      "#input-type-configurator-container"
    )!;
    this.$inputTypeConfigurator = new InputTypeConfigurator(
      this.selectedTitlesState,
      this.selectedInputTypesState
    );
    this.$inputTypeConfiguratorContainer.appendChild(
      this.$inputTypeConfigurator
    );
  };

  private $initHtmlListener(): void {
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

  private initStateListener(): void {
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
    this.configurationProgressState.value =
      TemplateConfigurationProgress.SELECT_INPUT_TYPES;
  };

  private $onBackToTopicConfiguration = () => {
    this.configurationProgressState.value =
      TemplateConfigurationProgress.SELECT_TOPICS;
    this.selectedInputTypesState.value = [];
  };

  private $onFinishInputTypeConfiguration = async () => {
    const template: Template = this.selectedTitlesState.value.map(
        (title, index) => {
          return {
            title,
            inputType: this.selectedInputTypesState.value[index],
          };
        }
      ),
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
