import WebComponent from "../../../lib/components/WebComponent";
import LiveTextInput from "../LiveTextInput/LiveTextInput";
import State from "../../../lib/state/State";
import html from "./LiveCheckListItem.html";
import css from "./LiveCheckListItem.css";

/**
 * @class LiveCheckListItem
 * A checklist item that can be edited
 */
export default class LiveCheckListItem extends WebComponent {
  private $checkListItemContainer!: HTMLDivElement;
  private $checkbox!: HTMLInputElement;
  private $liveTextInput!: LiveTextInput;

  private readonly textValueState: State<string>;
  private readonly isCheckedState: State<boolean>;

  /**
   * Creates a new LiveCheckListItem
   * @param textValueState The state of the text value
   * @param isChecked The state of the checkbox
   */
  constructor(textValueState: State<string>, isChecked: State<boolean>) {
    super(html, css);
    this.textValueState = textValueState;
    this.isCheckedState = isChecked;
  }

  get htmlTagName(): string {
    return "check-list-item";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListeners();
  }

  private $initHtml(): void {
    this.classList.add("list-item");
    this.classList.add("editor-atomic-item");

    this.$checkListItemContainer = this.select(".check-list-item-container")!;
    this.$checkbox = this.select("input")!;

    this.$liveTextInput = new LiveTextInput(this.textValueState, true);
    this.$checkListItemContainer.appendChild(this.$liveTextInput);

    if (this.isCheckedState.value) {
      this.$checkbox.checked = this.isCheckedState.value;
      this.onToggleChecked();
    }
  }

  private initListeners = () => {
    this.$checkbox.addEventListener("change", this.$onCheckboxChanged);
    this.isCheckedState.addEventListener("change", this.onCheckedStateChanged);
  };

  private $onCheckboxChanged = (event: Event) => {
    this.isCheckedState.value = (event.target as HTMLInputElement).checked;
  };

  private onCheckedStateChanged = () => {
    if (this.isCheckedState.value) {
      this.onToggleChecked();
    } else {
      this.onToggleUnchecked();
    }
  };

  private onToggleChecked = () => {
    this.$checkListItemContainer.classList.add("checked");
  };

  private onToggleUnchecked = () => {
    this.$checkListItemContainer.classList.remove("checked");
  };
}
