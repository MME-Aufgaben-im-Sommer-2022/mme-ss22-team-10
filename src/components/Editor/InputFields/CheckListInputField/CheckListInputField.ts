import WebComponent from "../../../../lib/components/WebComponent";
import html from "./CheckListInputField.html";
import State from "../../../../lib/state/State";
import LiveCheckListItem from "../../../atomics/LiveCheckListItem/LiveCheckListItem";

/**
 * @class CheckListInputField
 * Input field for check list items
 */
export default class CheckListInputField extends WebComponent {
  private $checkListContainer!: HTMLUListElement;
  private $newCheckListItemInputContainer!: HTMLLIElement;
  private $newCheckListItemInput!: HTMLInputElement;

  // the whole list of checklist items as single string, separated by newlines (\n)
  private readonly inputValueState: State<string>;
  // the split up bullet points (e.g. ["1___item 1", "0___item 2"])
  private readonly checkListStates: State<Array<string>>;

  static readonly CHECK_LIST_CONTENT_SEPARATOR = " ";
  static readonly CHECK_LIST_IS_CHECKED_MARK = "[X]";
  static readonly CHECK_LIST_IS_UNCHECKED_MARK = "[-]";

  /**
   * Creates a new checklist input field
   * @param inputValueState The state of the checklist input field
   */
  constructor(inputValueState: State<string>) {
    super(html);
    this.inputValueState = inputValueState;
    const splitStates = this.inputValueState.value.split("\n");
    this.checkListStates = new State<Array<string>>([]);
    splitStates.forEach((splitState) => {
      if (splitState !== "") {
        this.checkListStates.value.push(splitState);
      }
    });
  }

  get htmlTagName(): string {
    return "check-list-input-field";
  }

  onCreate(): Promise<void> | void {
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

  /**
   * Creates a single check list item
   * @param checkListIndex The index of the check list item
   */
  private $createCheckListItem = (
    checkListIndex: number
  ): LiveCheckListItem => {
    const checkListItemString = this.checkListStates.value[checkListIndex],
      isCheckedMark = checkListItemString.split(
        CheckListInputField.CHECK_LIST_CONTENT_SEPARATOR
      )[0],
      checkListContent = checkListItemString
        .split(CheckListInputField.CHECK_LIST_CONTENT_SEPARATOR)
        .splice(1)
        .join(CheckListInputField.CHECK_LIST_CONTENT_SEPARATOR),
      isCheckedState = new State(
        isCheckedMark.trim() === CheckListInputField.CHECK_LIST_IS_CHECKED_MARK
      ),
      checkListContentState = new State(checkListContent.trim()),
      $checkListItem = new LiveCheckListItem(
        checkListContentState,
        isCheckedState
      );

    if (isCheckedMark === undefined || checkListContent === undefined) {
      throw new InvalidCheckListItemError(
        this.checkListStates.value[checkListIndex],
        this.inputValueState.value,
        isCheckedMark,
        checkListContent
      );
    }

    // listen for changes and update the original state
    isCheckedState.addEventListener("change", () => {
      this.onCheckListItemChanged(
        checkListIndex,
        isCheckedState.value,
        checkListContentState.value
      );
    });
    checkListContentState.addEventListener("change", () => {
      if (checkListContentState.value.trim() === "") {
        $checkListItem.remove();
      }
      this.onCheckListItemChanged(
        checkListIndex,
        isCheckedState.value,
        checkListContentState.value
      );
    });
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
    this.inputValueState.value = this.checkListStates.value
      .filter(
        (checkListItem) =>
          checkListItem
            .split(CheckListInputField.CHECK_LIST_CONTENT_SEPARATOR)
            .splice(1)
            .join(CheckListInputField.CHECK_LIST_CONTENT_SEPARATOR)
            .trim() !== ""
      )
      .join("\n");
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

/**
 * @class InvalidCheckListItemError
 * An error that is thrown when a checklist item is of invalid format
 */
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
