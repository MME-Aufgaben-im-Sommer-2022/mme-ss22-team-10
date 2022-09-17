import WebComponent from "../../../lib/components/WebComponent";
import html from "./TopicConfigurator.html";
import css from "./TopicConfigurator.css";
import TopicConfiguratorItem from "./TopicConfiguratorItem/TopicConfiguratorItem";
import State from "../../../lib/state/State";
import TemplateConfigurationModel from "../../../data/models/TemplateConfigurationModel";
import { TemplateItem } from "../../../data/models/UserSettingsModel";

/**
 * @class TopicConfigurator
 * Component to configure the topics of the template
 */

export default class TopicConfigurator extends WebComponent {
  static readonly NEXT_BUTTON_CLICKED_EVENT = "onFinishTopicConfiguration";
  // eslint-disable-next-line no-magic-numbers
  static readonly MAX_TOPICS = 3;
  // eslint-disable-next-line no-magic-numbers
  static readonly MIN_TOPICS = 3;

  private readonly templateConfigurationModelState: State<TemplateConfigurationModel>;
  private readonly selectedTemplateItems: State<Array<TemplateItem>>;

  private $topicConfigurationItemsContainer!: HTMLDivElement;
  private $nextButton!: HTMLButtonElement;

  /**
   * Creates a new TopicConfigurator
   * @param templateConfigurationModelState The state of the template configuration model
   * @param selectedTemplateItems The state of the selected template items
   */
  constructor(
    templateConfigurationModelState: State<TemplateConfigurationModel>,
    selectedTemplateItems: State<Array<TemplateItem>>
  ) {
    super(html, css);
    this.templateConfigurationModelState = templateConfigurationModelState;
    this.selectedTemplateItems = selectedTemplateItems;
  }

  get htmlTagName(): string {
    return "topic-configurator";
  }

  onCreate(): Promise<void> | void {
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
    this.selectedTemplateItems.addEventListener(
      "change",
      this.onSelectedTitlesChanged
    );
  }

  private onSelectedTitlesChanged = () => {
    if (
      this.selectedTemplateItems.value.length > TopicConfigurator.MAX_TOPICS
    ) {
      this.$nextButton.disabled = true;
      this.$nextButton.textContent = `Select at max ${TopicConfigurator.MAX_TOPICS} topics`;
    } else if (
      this.selectedTemplateItems.value.length < TopicConfigurator.MIN_TOPICS
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
        this.selectedTemplateItems
      );
      this.$topicConfigurationItemsContainer.appendChild(topicConfiguration);
    });
  }
}
