import WebComponent from "../../../../lib/components/WebComponent";
import html from "./CheckListInputField.html";
import State from "../../../../lib/state/State";
import { log } from "../../../../lib/utils/Logger";
import CheckListItem from "../../ListItems/CheckListItem/CheckListItem";

export default class CheckListInputField extends WebComponent {
  inputValueState: State<string>;
  checkListStates: State<Array<string>>;
  $checkListContainer!: HTMLUListElement;

  private static CHECK_LIST_CONTENT_SEPARATOR = "___";
  private static CHECK_LIST_IS_CHECKED_MARK = "1";
  private static CHECK_LIST_IS_UNCHECKED_MARK = "0";

  constructor(inputValueState: State<string>) {
    super(html);
    this.inputValueState = inputValueState;
    this.checkListStates = new State<Array<string>>(
      this.inputValueState.value.split("\n")
    );
  }

  get htmlTagName(): string {
    return "check-list-input-field";
  }

  onCreate(): void {
    this.$initHtml();
    this.initListeners();
  }

  private initListeners(): void {
    this.checkListStates.addEventListener(
      "change",
      this.onBulletPointsStateChanged
    );
  }

  private onBulletPointsStateChanged = () => {
    // update the original string state
    this.inputValueState.value = this.checkListStates.value.join("\n");
    log("ALL bullet points changed", this.checkListStates.value);
  };

  private $initHtml(): void {
    this.$checkListContainer = this.select(".check-list-container")!;
    this.$appendCheckListItems();
  }

  private $appendCheckListItems = () => {
    this.checkListStates.value.forEach((_, index) => {
      this.$checkListContainer.appendChild(this.$createCheckListItem(index));
    });
  };

  private $createCheckListItem = (checkListIndex: number): CheckListItem => {
    const [isChecked, checkListContent] = this.checkListStates.value[
        checkListIndex
      ].split(CheckListInputField.CHECK_LIST_CONTENT_SEPARATOR),
      isCheckedState = new State(
        isChecked.trim() === CheckListInputField.CHECK_LIST_IS_CHECKED_MARK
      ),
      checkListContentState = new State(checkListContent.trim()),
      $checkListItem = new CheckListItem(checkListContentState, isCheckedState);

    log("created check list item from string", isChecked, checkListContent);
    isCheckedState.addEventListener("change", () =>
      this.onCheckListItemChanged(
        checkListIndex,
        isCheckedState.value,
        checkListContentState.value
      )
    );
    checkListContentState.addEventListener("change", () =>
      this.onCheckListItemChanged(
        checkListIndex,
        isCheckedState.value,
        checkListContentState.value
      )
    );
    return $checkListItem;
  };

  private onCheckListItemChanged = (
    checkListIndex: number,
    isChecked: boolean,
    checkListContent: string
  ) => {
    this.checkListStates.value[checkListIndex] = `${
      isChecked
        ? CheckListInputField.CHECK_LIST_IS_CHECKED_MARK
        : CheckListInputField.CHECK_LIST_IS_UNCHECKED_MARK
    }${CheckListInputField.CHECK_LIST_CONTENT_SEPARATOR}${checkListContent}`;
  };
}
