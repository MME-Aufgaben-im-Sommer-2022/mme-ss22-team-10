import WebComponent from "../../../../lib/components/WebComponent";
import html from "./CheckListInputField.html";
import State from "../../../../lib/state/State";
import LiveCheckListItem from "../../atomics/LiveCheckListItem/LiveCheckListItem";

// Input field for check list items

// Necessary constructor parameters:
// - inputValueState:
//   - a string, that contains all checklist items, separated by newlines (\n)
//     - checked items are prefixed with a "1___"
//     - unchecked items are prefixed with a "0___"
//   - the state is updated the user finishes editing an item

export default class CheckListInputField extends WebComponent {
  private $checkListContainer!: HTMLUListElement;
  private $newCheckListItemInputContainer!: HTMLLIElement;
  private $newCheckListItemInput!: HTMLInputElement;

  // the whole list of checklist items as single string, separated by newlines (\n)
  private readonly inputValueState: State<string>;
  // the split up bullet points (e.g. ["1___item 1", "0___item 2"])
  private readonly checkListStates: State<Array<string>>;

  static readonly CHECK_LIST_CONTENT_SEPARATOR = "___";
  static readonly CHECK_LIST_IS_CHECKED_MARK = "1";
  static readonly CHECK_LIST_IS_UNCHECKED_MARK = "0";

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

  private $initHtml(): void {
    this.$checkListContainer = this.select(".check-list-container")!;
    this.$newCheckListItemInputContainer = this.select(
      ".new-check-list-item-input-container"
    )!;
    this.$newCheckListItemInput = this.select(".new-check-list-item-input")!;

    this.$appendCheckListItems();
  }

  private $appendCheckListItems = () => {
    this.checkListStates.value.forEach((_, index) => {
      this.$checkListContainer.insertBefore(
        this.$createCheckListItem(index),
        this.$newCheckListItemInputContainer
      );
    });
  };

  private $createCheckListItem = (
    checkListIndex: number
  ): LiveCheckListItem => {
    const checkListItemString = this.checkListStates.value[checkListIndex],
      [isChecked, checkListContent] = checkListItemString.split(
        CheckListInputField.CHECK_LIST_CONTENT_SEPARATOR
      ),
      isCheckedState = new State(
        isChecked.trim() === CheckListInputField.CHECK_LIST_IS_CHECKED_MARK
      ),
      checkListContentState = new State(checkListContent.trim()),
      $checkListItem = new LiveCheckListItem(
        checkListContentState,
        isCheckedState
      );

    if (isChecked === undefined || checkListContent === undefined) {
      throw new InvalidCheckListItemError(
        this.checkListStates.value[checkListIndex],
        this.inputValueState.value,
        isChecked,
        checkListContent
      );
    }

    // listen for changes and update the original state
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

  private initListeners(): void {
    this.checkListStates.addEventListener(
      "change",
      this.onBulletPointsStateChanged
    );
    this.$newCheckListItemInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.addNewCheckListItem();
      }
    });
  }

  private addNewCheckListItem(): void {
    const newCheckListItem = this.$newCheckListItemInput.value.trim();
    if (newCheckListItem.length > 0) {
      this.checkListStates.value.push(
        CheckListInputField.CHECK_LIST_IS_UNCHECKED_MARK +
          CheckListInputField.CHECK_LIST_CONTENT_SEPARATOR +
          newCheckListItem
      );
      this.$checkListContainer.insertBefore(
        this.$createCheckListItem(this.checkListStates.value.length - 1),
        this.$newCheckListItemInputContainer
      );
      this.$newCheckListItemInput.value = "";
    }
  }

  private onBulletPointsStateChanged = () => {
    // update the original string state
    this.inputValueState.value = this.checkListStates.value.join("\n");
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

export class InvalidCheckListItemError extends Error {
  constructor(
    checkListItem: string,
    fullCheckListString: string,
    isChecked: string | undefined,
    content: string | undefined
  ) {
    super(`Invalid check list item: ${checkListItem}
    
    Is the item of the following format?
    - ${CheckListInputField.CHECK_LIST_IS_CHECKED_MARK}${CheckListInputField.CHECK_LIST_CONTENT_SEPARATOR}example content
    - ${CheckListInputField.CHECK_LIST_IS_UNCHECKED_MARK}${CheckListInputField.CHECK_LIST_CONTENT_SEPARATOR}example content
    
    Detailed error:
    - fullCheckListString: ${fullCheckListString}
    - checkListItem: ${checkListItem}
    - isChecked: ${isChecked}
    - content: ${content}
    `);
  }
}
