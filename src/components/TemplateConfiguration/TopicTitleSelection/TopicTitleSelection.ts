import WebComponent from "../../../lib/components/WebComponent";
import { Topic } from "../../../data/models/TemplateConfigurationModel";
import State from "../../../lib/state/State";
import html from "./TopicTitleSelection.html";

export default class TopicTitleSelection extends WebComponent {
  private readonly topicState: State<Topic>;
  private readonly selectionIndexState: State<number>;

  private $topicTitleSelectionContainer!: HTMLDivElement;
  private $topicName!: HTMLSpanElement;

  constructor(topicState: State<Topic>, selectionIndexState: State<number>) {
    super(html);
    this.topicState = topicState;
    this.selectionIndexState = selectionIndexState;
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
    this.$topicName.innerHTML = this.topicState.value.name;
    this.$appendRadioButtons();
  }

  private initListener(): void {
    this.selectionIndexState.addEventListener(
      "change",
      this.$updateRadioButtons
    );
  }

  $appendRadioButtons(): void {
    this.topicState.value.titles.forEach((title, index) => {
      const radioButton = document.createElement("input"),
        label = document.createElement("label");
      radioButton.type = "radio";
      radioButton.name = "topic-title";
      radioButton.value = title;
      this.$topicTitleSelectionContainer.appendChild(radioButton);

      label.innerHTML = title;
      this.$topicTitleSelectionContainer.appendChild(label);

      radioButton.addEventListener("change", () =>
        this.$onSelectRadioButton(index)
      );
    });

    this.$updateRadioButtons();
  }

  private $updateRadioButtons = () => {
    const radioButtons: NodeList =
      this.$topicTitleSelectionContainer.querySelectorAll("input[type=radio]");
    radioButtons.forEach((radioButton, index) => {
      (radioButton as HTMLInputElement).checked =
        index === this.selectionIndexState.value;
    });
  };

  $onSelectRadioButton = (index: number) => {
    this.selectionIndexState.value = index;
  };
}
