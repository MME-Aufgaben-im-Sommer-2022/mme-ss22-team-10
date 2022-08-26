import WebComponent from "../../../lib/components/WebComponent";
import html from "./TopicConfigurator.html";
import TopicConfiguratorItem from "./TopicConfiguratorItem/TopicConfiguratorItem";
import State from "../../../lib/state/State";
import TemplateConfigurationModel from "../../../data/models/TemplateConfigurationModel";
export default class TopicConfigurator extends WebComponent {
  static readonly NEXT_BUTTON_CLICKED_EVENT = "onFinishTopicConfiguration";
  // eslint-disable-next-line no-magic-numbers
  static readonly MAX_TOPICS = 3;
  // eslint-disable-next-line no-magic-numbers
  static readonly MIN_TOPICS = 3;

  private readonly templateConfigurationModelState: State<TemplateConfigurationModel>;
  private readonly selectedTitlesState: State<Array<string>>;

  private $topicConfigurationItemsContainer!: HTMLDivElement;
  private $nextButton!: HTMLButtonElement;

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
    this.$topicConfigurationItemsContainer = this.select(
      "#topic-configurator-items-container"
    )!;
    this.$nextButton = this.select("#topic-configurator-next-button")!;
    this.$appendTopicConfiguratorItems();
    this.onSelectedTitlesChanged();
  }

  private initListener(): void {
    this.$nextButton.addEventListener("click", this.$onNextButtonClicked);
    this.selectedTitlesState.addEventListener(
      "change",
      this.onSelectedTitlesChanged
    );
  }

  private onSelectedTitlesChanged = () => {
    if (this.selectedTitlesState.value.length > TopicConfigurator.MAX_TOPICS) {
      this.$nextButton.disabled = true;
      this.$nextButton.textContent = `Select at max ${TopicConfigurator.MAX_TOPICS} topics`;
    } else if (
      this.selectedTitlesState.value.length < TopicConfigurator.MIN_TOPICS
    ) {
      this.$nextButton.disabled = true;
      this.$nextButton.textContent = `Select at least ${TopicConfigurator.MIN_TOPICS} topics`;
    } else {
      this.$nextButton.disabled = false;
      this.$nextButton.textContent = "Next";
    }
  };

  private $onNextButtonClicked = (): void => {
    this.notifyAll(TopicConfigurator.NEXT_BUTTON_CLICKED_EVENT, {});
  };

  private $appendTopicConfiguratorItems(): void {
    this.templateConfigurationModelState.value.topics.forEach((topic) => {
      const topicConfiguration = new TopicConfiguratorItem(
        topic,
        this.selectedTitlesState
      );
      this.$topicConfigurationItemsContainer.appendChild(topicConfiguration);
    });
  }
}
