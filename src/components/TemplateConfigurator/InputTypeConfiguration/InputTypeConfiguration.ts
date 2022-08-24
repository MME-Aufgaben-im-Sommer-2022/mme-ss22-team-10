import WebComponent from "../../../lib/components/WebComponent";
import html from "./InputTypeConfiguration.html";
import State from "../../../lib/state/State";
import { BlockContentInputType } from "../../../data/models/EditorModel";

export default class InputTypeConfiguration extends WebComponent {
  private readonly topicTitle: string;
  private readonly selectedInputTypeState: State<BlockContentInputType>;

  private $topicTitle!: HTMLSpanElement;
  private $inputTypeSelection!: HTMLSelectElement;

  constructor(
    topicTitle: string,
    selectedInputTypeState: State<BlockContentInputType>
  ) {
    super(html);
    this.topicTitle = topicTitle;
    this.selectedInputTypeState = selectedInputTypeState;
  }

  get htmlTagName(): string {
    return "input-type-configuration";
  }

  onCreate(): void {
    this.$initHtml();
    this.initListener();
  }

  $initHtml(): void {
    this.$topicTitle = this.select(".topic-title")!;
    this.$topicTitle.innerHTML = this.topicTitle;
    this.$inputTypeSelection = this.select(
      ".input-type-configuration-selection"
    )!;
    this.$appendOptions();
  }

  private initListener(): void {
    this.selectedInputTypeState.addEventListener(
      "change",
      this.$onSelectionChanged
    );
  }

  $onSelectionChanged = (): void => {
    this.$inputTypeSelection.value = this.selectedInputTypeState.value;
  };

  private $appendOptions(): void {
    Object.keys(BlockContentInputType).forEach((inputType) => {
      const option = document.createElement("option");
      option.value = inputType;
      option.innerHTML = inputType;
      this.$inputTypeSelection.appendChild(option);
    });
  }
}
