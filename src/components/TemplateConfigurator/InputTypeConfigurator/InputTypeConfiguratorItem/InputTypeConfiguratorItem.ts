import WebComponent from "../../../../lib/components/WebComponent";
import html from "./InputTypeConfiguratorItem.html";
import css from "./InputTypeConfiguratorItem.css";
import State from "../../../../lib/state/State";
import { BlockContentInputType } from "../../../../data/models/EditorModel";

export default class InputTypeConfiguratorItem extends WebComponent {
  private readonly topicTitle: string;
  private readonly selectedInputTypeState: State<BlockContentInputType>;

  private $topicTitle!: HTMLSpanElement;
  private $inputTypeSelection!: HTMLSelectElement;

  constructor(
    topicTitle: string,
    selectedInputTypeState: State<BlockContentInputType>
  ) {
    super(html, css);
    this.topicTitle = topicTitle;
    this.selectedInputTypeState = selectedInputTypeState;
  }

  get htmlTagName(): string {
    return "input-type-configurator-item";
  }

  onCreate(): Promise<void> | void {
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
    this.$inputTypeSelection.addEventListener(
      "change",
      this.$onSelectionChanged
    );
  }

  $onSelectionChanged = (): void => {
    this.selectedInputTypeState.value = this.$inputTypeSelection
      .value as BlockContentInputType;
  };

  private $appendOptions(): void {
    Object.keys(BlockContentInputType).forEach((inputType) => {
      const option = document.createElement("option");
      option.value =
        BlockContentInputType[inputType as keyof typeof BlockContentInputType];
      option.innerHTML = inputType;
      this.$inputTypeSelection.appendChild(option);
    });
  }
}
