import WebComponent from "../../lib/components/WebComponent";
import TemplateConfigurationModel from "../../data/models/TemplateConfigurationModel";
import State from "../../lib/state/State";
import { Template } from "../../data/models/UserSettingsModel";
import TopicConfiguration from "./TopicConfiguration/TopicConfiguration";
import html from "./TemplateConfiguration.html";
import { BlockContentInputType } from "../../data/models/EditorModel";
import InputTypeConfiguration from "./InputTypeConfiguration/InputTypeConfiguration";
import { log } from "../../lib/utils/Logger";

enum TemplateConfigurationProgress {
  SELECT_TOPICS,
  SELECT_INPUT_TYPES,
}

export default class TemplateConfiguration extends WebComponent {
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

  private $topicConfiguration!: HTMLDivElement;
  private $topicConfigurationElementsContainer!: HTMLDivElement;
  private $finishTopicConfigurationButton!: HTMLButtonElement;

  private $inputTypeConfiguration!: HTMLDivElement;
  private $inputTypeConfigurationElementsContainer!: HTMLDivElement;
  private $backToTopicConfigurationButton!: HTMLButtonElement;
  private $finishTemplateConfigurationButton!: HTMLButtonElement;

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
    this.$topicConfiguration = this.select("#topic-configuration")!;
    this.$topicConfigurationElementsContainer = this.select(
      "#topic-configuration-elements-container"
    )!;
    this.$finishTopicConfigurationButton = this.select(
      "#finish-topic-configuration-button"
    )!;
    this.$inputTypeConfiguration = this.select("#input-type-configuration")!;
    this.$inputTypeConfigurationElementsContainer = this.select(
      "#input-type-configuration-elements-container"
    )!;
    this.$backToTopicConfigurationButton = this.select(
      "#back-to-topic-configuration-button"
    )!;
    this.$finishTemplateConfigurationButton = this.select(
      "#finish-template-configuration-button"
    )!;
    this.$appendTopicConfigurations();
  }

  private $initHtmlListener(): void {
    this.$finishTopicConfigurationButton.addEventListener(
      "click",
      this.$onFinishTopicConfiguration
    );
    this.$backToTopicConfigurationButton.addEventListener(
      "click",
      this.$onBackToTopicConfiguration
    );
    this.$finishTemplateConfigurationButton.addEventListener(
      "click",
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
      this.$topicConfiguration.hidden = false;
      this.$inputTypeConfiguration.hidden = true;
      this.$inputTypeConfigurationElementsContainer.innerHTML = "";
      this.selectedInputTypesState.value = [];
    } else {
      this.$topicConfiguration.hidden = true;
      this.$inputTypeConfiguration.hidden = false;
      this.$appendInputTypeConfigurations();
    }
  };

  private $onFinishTopicConfiguration = () => {
    this.templateConfigurationProgressState.value =
      TemplateConfigurationProgress.SELECT_INPUT_TYPES;
  };

  private $onFinishTemplateConfiguration = () => {};

  private $onBackToTopicConfiguration = () => {
    this.templateConfigurationProgressState.value =
      TemplateConfigurationProgress.SELECT_TOPICS;
  };

  private $appendTopicConfigurations(): void {
    this.templateConfigurationModelState.value.topics.forEach((topic) => {
      const topicConfiguration = new TopicConfiguration(
        topic,
        this.selectedTitlesState
      );
      this.$topicConfigurationElementsContainer.appendChild(topicConfiguration);
    });
  }

  private $appendInputTypeConfigurations(): void {
    this.selectedTitlesState.value.forEach((title, index) => {
      log("appending");
      const selectedInputTypeState = new State<BlockContentInputType>(
          BlockContentInputType.FreeText
        ),
        inputTypeConfiguration = new InputTypeConfiguration(
          title,
          selectedInputTypeState
        );
      this.selectedInputTypesState.value.push(selectedInputTypeState.value);

      selectedInputTypeState.addEventListener("change", () => {
        this.selectedInputTypesState.value[index] =
          selectedInputTypeState.value;
      });

      this.$inputTypeConfigurationElementsContainer.appendChild(
        inputTypeConfiguration
      );
    });
  }
}
