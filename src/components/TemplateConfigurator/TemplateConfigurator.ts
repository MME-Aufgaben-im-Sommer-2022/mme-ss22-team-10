import WebComponent from "../../lib/components/WebComponent";
import TemplateConfigurationModel from "../../data/models/TemplateConfigurationModel";
import State from "../../lib/state/State";
import { Template } from "../../data/models/UserSettingsModel";
import html from "./TemplateConfigurator.html";
import { BlockContentInputType } from "../../data/models/EditorModel";
import TopicConfigurator from "./TopicConfigurator/TopicConfigurator";
import InputTypeConfigurator from "./InputTypeConfigurator/InputTypeConfigurator";

enum TemplateConfigurationProgress {
  SELECT_TOPICS,
  SELECT_INPUT_TYPES,
}

export default class TemplateConfigurator extends WebComponent {
  private readonly templateConfigurationModelState: State<TemplateConfigurationModel>;
  private readonly selectedTitlesState: State<Array<string>> = new State([]);
  private readonly selectedInputTypesState: State<
    Array<BlockContentInputType>
  > = new State([]);

  private readonly templateConfigurationProgressState: State<TemplateConfigurationProgress> =
    new State<TemplateConfigurationProgress>(
      TemplateConfigurationProgress.SELECT_TOPICS
    );

  private readonly onFinishConfiguration: (template: Template) => void;

  private $topicConfiguratorContainer!: HTMLDivElement;
  private $topicConfigurator!: TopicConfigurator;

  private $inputTypeConfiguratorContainer!: HTMLDivElement;
  private $inputTypeConfigurator!: InputTypeConfigurator;

  constructor(
    templateConfigurationModelState: State<TemplateConfigurationModel>,
    onFinishConfiguration: (template: Template) => void
  ) {
    super(html);
    this.templateConfigurationModelState = templateConfigurationModelState;
    this.onFinishConfiguration = onFinishConfiguration;
  }

  get htmlTagName(): string {
    return "template-configuration";
  }

  onCreate(): void {
    this.$initHtml();
    this.$initHtmlListener();
    this.initStateListener();
  }

  $initHtml(): void {
    this.$topicConfiguratorContainer = this.select("#topic-configuration")!;
    this.$topicConfigurator = new TopicConfigurator(
      this.templateConfigurationModelState,
      this.selectedTitlesState
    );
    this.$topicConfiguratorContainer.appendChild(this.$topicConfigurator);

    this.$inputTypeConfiguratorContainer = this.select(
      "#input-type-configuration"
    )!;
    this.$inputTypeConfigurator = new InputTypeConfigurator(
      this.selectedTitlesState,
      this.selectedInputTypesState
    );
    this.$inputTypeConfiguratorContainer.appendChild(
      this.$inputTypeConfigurator
    );
  }

  private $initHtmlListener(): void {
    this.$topicConfigurator.addEventListener(
      TopicConfigurator.FINISH_TOPIC_CONFIGURATION_EVENT,
      this.$onFinishTopicConfiguration
    );
    this.$inputTypeConfigurator.addEventListener(
      InputTypeConfigurator.BACK_BUTTON_CLICKED_EVENT,
      this.$onBackToTopicConfiguration
    );
    this.$inputTypeConfigurator.addEventListener(
      InputTypeConfigurator.NEXT_BUTTON_CLICKED_EVENT,
      this.$onFinishTemplateConfiguration
    );
  }

  private initStateListener(): void {
    this.templateConfigurationProgressState.addEventListener(
      "change",
      this.$updateTemplateConfigurationProgress
    );
  }

  private $updateTemplateConfigurationProgress = () => {
    if (
      this.templateConfigurationProgressState.value ===
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
    this.templateConfigurationProgressState.value =
      TemplateConfigurationProgress.SELECT_INPUT_TYPES;
  };

  private $onFinishTemplateConfiguration = () => {
    this.selectedInputTypesState.value = [];
    const template: Template = this.selectedTitlesState.value.map(
      (title, index) => {
        return {
          title,
          inputType: this.selectedInputTypesState.value[index],
        };
      }
    );
    this.onFinishConfiguration(template);
  };

  private $onBackToTopicConfiguration = () => {
    this.templateConfigurationProgressState.value =
      TemplateConfigurationProgress.SELECT_TOPICS;
  };
}
