import WebComponent from "../../../../lib/components/WebComponent";
import { Topic } from "../../../../data/models/TemplateConfigurationModel";
import State from "../../../../lib/state/State";
import html from "./TopicConfiguratorItem.html";
import { TemplateItem } from "../../../../data/models/UserSettingsModel";

export default class TopicConfiguratorItem extends WebComponent {
  private readonly topic: Topic;
  private readonly selectedTemplateItems: State<Array<TemplateItem>>;

  private $topicTitleSelectionContainer!: HTMLDivElement;
  private $topicName!: HTMLSpanElement;

  constructor(topic: Topic, selectedTemplateItems: State<Array<TemplateItem>>) {
    super(html);
    this.topic = topic;
    this.selectedTemplateItems = selectedTemplateItems;
  }

  get htmlTagName(): string {
    return "topic-configurator-item";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListener();
  }

  $initHtml(): void {
    this.$topicTitleSelectionContainer = this.select(
      ".topic-title-selection-container"
    )!;
    this.$topicName = this.select(".topic-name")!;
    this.$topicName.innerHTML = this.topic.name;
    this.$appendTopicItems();
  }

  private initListener(): void {
    this.selectedTemplateItems.addEventListener(
      "change",
      this.$updateCheckboxes
    );
  }

  $appendTopicItems(): void {
    this.topic.items.forEach((item) => {
      const checkbox = document.createElement("input"),
        label = document.createElement("label"),
        container = document.createElement("div");
      checkbox.type = "checkbox";
      checkbox.name = "topic-title";
      checkbox.value = item.title;
      container.appendChild(checkbox);

      label.innerHTML = item.title;
      container.appendChild(label);

      this.$topicTitleSelectionContainer.appendChild(container);

      checkbox.addEventListener("change", () =>
        this.$onClickCheckbox(item, checkbox.checked)
      );
    });

    this.$updateCheckboxes();
  }

  private $updateCheckboxes = () => {
    const checkboxes: NodeList =
      this.$topicTitleSelectionContainer.querySelectorAll(
        "input[type=checkbox]"
      );

    checkboxes.forEach(($checkbox) => {
      ($checkbox as HTMLInputElement).checked =
        this.selectedTemplateItems.value.find(
          (templateItem) =>
            templateItem.title === ($checkbox as HTMLInputElement).value
        ) !== undefined
          ? true
          : false;
    });
  };

  $onClickCheckbox = (item: TemplateItem, isChecked: boolean) => {
    if (isChecked) {
      this.selectedTemplateItems.value.push(item);
    } else {
      this.selectedTemplateItems.value =
        this.selectedTemplateItems.value.filter(
          (_item) => _item.title !== item.title
        );
    }
  };
}
