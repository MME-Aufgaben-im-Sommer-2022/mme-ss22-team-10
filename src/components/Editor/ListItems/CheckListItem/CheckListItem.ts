import WebComponent from "../../../../lib/components/WebComponent";
import EditableListItem from "../EditableListItem/EditableListItem";
import State from "../../../../lib/state/State";

export default class CheckListItem extends WebComponent {
  private $checkbox!: HTMLInputElement;
  private $editableListItem!: EditableListItem;

  private textValueState: State<string>;
  private isCheckedState: State<boolean>;

  constructor(textValue: State<string>, isChecked: State<boolean>) {
    super();
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
    this.$checkbox = this.select("input")!;
    this.$checkbox.checked = this.isCheckedState.value;
    this.$editableListItem = new EditableListItem(this.textValueState);
    this.select("li")?.appendChild(this.$editableListItem);
  }

  private initListeners(): void {
    this.$checkbox.addEventListener("input", this.$onCheckboxChanged);
    this.isCheckedState.addEventListener("change", this.onCheckedStateChanged);
  }

  private $onCheckboxChanged = (event: Event) => {
    this.isCheckedState.value = (event.target as HTMLInputElement).checked;
  };

  private onCheckedStateChanged = (): void => {
    if (this.isCheckedState.value) {
      this.onToggleChecked();
    } else {
      this.onToggleUnchecked();
    }
  };

  private onToggleChecked = () => {
    this.classList.add("checked");
  };

  private onToggleUnchecked = () => {
    this.classList.remove("checked");
  };
}
