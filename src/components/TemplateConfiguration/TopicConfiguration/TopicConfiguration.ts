import WebComponent from "../../../lib/components/WebComponent";
import { Topic } from "../../../data/models/TemplateConfigurationModel";
import State from "../../../lib/state/State";
import html from "./TopicConfiguration.html";

export default class TopicConfiguration extends WebComponent {
  private readonly topic: Topic;
  private readonly selectedTopicsState: State<Array<string>>;

  private $topicTitleSelectionContainer!: HTMLDivElement;
  private $topicName!: HTMLSpanElement;

  constructor(topic: Topic, selectedTopicsState: State<Array<string>>) {
    super(html);
    this.topic = topic;
    this.selectedTopicsState = selectedTopicsState;
  }

  get htmlTagName(): string {
    return "topic-title-selection";
  }

  onCreate(): void {
    this.$initHtml();
    this.initListener();
  }

  $initHtml(): void {
    this.$topicTitleSelectionContainer = this.select(
      ".topic-title-selection-container"
    )!;
    this.$topicName = this.select(".topic-name")!;
    this.$topicName.innerHTML = this.topic.name;
    this.$appendRadioButtons();
  }

  private initListener(): void {
    this.selectedTopicsState.addEventListener(
      "change",
      this.$updateRadioButtons
    );
  }

  $appendRadioButtons(): void {
    this.topic.titles.forEach((title) => {
      const radioButton = document.createElement("input"),
        label = document.createElement("label");
      radioButton.type = "checkbox";
      radioButton.name = "topic-title";
      radioButton.value = title;
      this.$topicTitleSelectionContainer.appendChild(radioButton);

      label.innerHTML = title;
      this.$topicTitleSelectionContainer.appendChild(label);

      radioButton.addEventListener("change", () =>
        this.$onSelectRadioButton(radioButton.value)
      );
    });

    this.$updateRadioButtons();
  }

  private $updateRadioButtons = () => {
    const radioButtons: NodeList =
      this.$topicTitleSelectionContainer.querySelectorAll(
        "input[type=checkbox]"
      );
    radioButtons.forEach((radioButton) => {
      (radioButton as HTMLInputElement).checked =
        this.selectedTopicsState.value.includes(
          (radioButton as HTMLInputElement).value
        );
    });
  };

  $onSelectRadioButton = (value: string) => {
    this.selectedTopicsState.value.push(value);
  };
}
