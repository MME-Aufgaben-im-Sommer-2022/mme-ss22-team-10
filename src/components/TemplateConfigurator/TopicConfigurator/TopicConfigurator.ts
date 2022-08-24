import WebComponent from "../../../lib/components/WebComponent";
import html from "./TopicConfigurator.html";
import TopicConfiguratorItem from "./TopicConfiguratorItem/TopicConfiguratorItem";
import State from "../../../lib/state/State";
import TemplateConfigurationModel from "../../../data/models/TemplateConfigurationModel";
export default class TopicConfigurator extends WebComponent {
  static readonly FINISH_TOPIC_CONFIGURATION_EVENT =
    "onFinishTopicConfiguration";

  private readonly templateConfigurationModelState: State<TemplateConfigurationModel>;
  private readonly selectedTitlesState: State<Array<string>>;

  private $topicConfigurationElementsContainer!: HTMLDivElement;
  private $finishTopicConfigurationButton!: HTMLButtonElement;

  constructor(
    templateConfigurationModelState: State<TemplateConfigurationModel>,
    selectedTitlesState: State<Array<string>>
  ) {
    super(html);
    this.templateConfigurationModelState = templateConfigurationModelState;
    this.selectedTitlesState = selectedTitlesState;
  }

  get htmlTagName(): string {
    return "topic-configurator";
  }

  onCreate(): void {
    this.$initHtml();
    this.initListener();
  }

  private $initHtml() {
    this.$topicConfigurationElementsContainer = this.select(
      "#topic-configuration-elements-container"
    )!;
    this.$finishTopicConfigurationButton = this.select(
      "#finish-topic-configuration-button"
    )!;
    this.$appendTopicConfigurations();
  }

  private initListener(): void {
    this.$finishTopicConfigurationButton.addEventListener(
      "click",
      this.$onFinishTopicConfiguration
    );
  }

  private $onFinishTopicConfiguration = (): void => {
    this.notifyAll(TopicConfigurator.FINISH_TOPIC_CONFIGURATION_EVENT, {});
  };

  private $appendTopicConfigurations(): void {
    this.templateConfigurationModelState.value.topics.forEach((topic) => {
      const topicConfiguration = new TopicConfiguratorItem(
        topic,
        this.selectedTitlesState
      );
      this.$topicConfigurationElementsContainer.appendChild(topicConfiguration);
    });
  }
}
