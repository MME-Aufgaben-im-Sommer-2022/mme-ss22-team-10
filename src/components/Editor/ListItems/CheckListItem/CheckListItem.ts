import WebComponent from "../../../../lib/components/WebComponent";
import LiveTextInput from "../LiveTextInput/LiveTextInput";
import State from "../../../../lib/state/State";
import html from "./CheckListItem.html";
import css from "./CheckListItem.css";

export default class CheckListItem extends WebComponent {
  private $checkListItemContainer!: HTMLDivElement;
  private $checkbox!: HTMLInputElement;
  private $editableListItem!: LiveTextInput;

  private readonly textValueState: State<string>;
  private isCheckedState: State<boolean>;

  constructor(textValue: State<string>, isChecked: State<boolean>) {
    super(html, css);
    this.textValueState = textValue;
    this.isCheckedState = isChecked;
  }

  get htmlTagName(): string {
    return "check-list-item";
  }

  onCreate(): void {
    this.$initHtml();
    this.initListeners();
  }

  private $initHtml(): void {
    this.$checkListItemContainer = this.select(".check-list-item-container")!;
    this.$checkbox = this.select("input")!;
    this.$editableListItem = new LiveTextInput(this.textValueState);
    this.$checkListItemContainer.appendChild(this.$editableListItem);

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
