import WebComponent from "../../../lib/components/WebComponent";
import html from "./EditorBlock.html";
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

export default class EditorBlock extends WebComponent {
  blockContentState: State<BlockContent>;
  inputValueState: State<string>;

  $title!: HTMLSpanElement;
  $inputFieldContainer!: HTMLDivElement;
  $inputField!:
    | FreeTextInputField
    | BulletPointInputField
    | CheckListInputField;

  constructor(blockContentState: State<BlockContent>) {
    super(html);
    this.blockContentState = blockContentState;
    this.inputValueState = new State<string>(
      this.blockContentState.value.inputValue
    );
  }

  get htmlTagName(): string {
    return "editor-block";
  }

  onCreate(): void {
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
