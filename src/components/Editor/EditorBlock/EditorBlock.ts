import WebComponent from "../../../lib/components/WebComponent";
import html from "./EditorBlock.html";
import css from "./EditorBlock.css";
import FreeTextInputField from "../InputFields/FreeTextInputField/FreeTextInputField";
import State from "../../../lib/state/State";
import { AppEvent } from "../../../lib/events/AppEvent";
import {
  BlockContent,
  BlockContentInputType,
} from "../../../data/models/EditorModel";
import { log } from "../../../lib/utils/Logger";
import BulletPointInputField from "../InputFields/BulletPointInputField/BulletPointInputField";
import { StateChangedData } from "../../../events/StateChanged";
import CheckListInputField from "../InputFields/CheckListInputField/CheckListInputField";

/**
 * @class EditorBlock
 * A single block in the editor, consisting of:
 * - A title
 * - An input field, depending on the type of the block
 */
export default class EditorBlock extends WebComponent {
  blockContentState: State<BlockContent>;
  inputValueState: State<string>;

  $title!: HTMLSpanElement;
  $inputFieldContainer!: HTMLDivElement;
  $inputField!:
    | FreeTextInputField
    | BulletPointInputField
    | CheckListInputField;

  /**
   * Creates a new EditorBlock instance
   * @param blockContentState The state of the block content
   */
  constructor(blockContentState: State<BlockContent>) {
    super(html, css);
    this.blockContentState = blockContentState;
    this.inputValueState = new State<string>(
      this.blockContentState.value.inputValue ?? ""
    );
  }

  get htmlTagName(): string {
    return "editor-block";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.intiListeners();
  }

  private $initHtml(): void {
    this.$title = this.select(".title")!;
    this.$inputFieldContainer = this.select(".input-field-container")!;
    this.$title.innerHTML = this.blockContentState.value.title;

    this.appendInputField(this.blockContentState.value.inputType);
  }

  private intiListeners(): void {
    this.blockContentState.addEventListener("change", (event: AppEvent) =>
      this.onBlockContentStateChanged(event.data)
    );

    this.inputValueState.addEventListener("change", (event: AppEvent) => {
      log("inputValueState changed", event.data);
      this.blockContentState.value.inputValue = this.inputValueState.value;
    });
  }

  appendInputField = (inputType: BlockContentInputType) => {
    if (inputType === BlockContentInputType.FreeText) {
      this.$inputField = new FreeTextInputField(this.inputValueState);
    } else if (inputType === BlockContentInputType.BulletPoint) {
      this.$inputField = new BulletPointInputField(this.inputValueState);
    } else if (inputType === BlockContentInputType.Checkbox) {
      this.$inputField = new CheckListInputField(this.inputValueState);
    } else {
      throw new Error(`Unknown input type: ${inputType}`);
    }

    this.$inputFieldContainer.appendChild(this.$inputField);
  };

  onBlockContentStateChanged = (data: StateChangedData) => {
    log("onBlockContentStateChanged", data);
    if (data.property === "value.title") {
      this.$title.innerHTML = this.blockContentState.value.title;
    } else if (data.property === "value.inputType") {
      // ...
    }
  };
}
