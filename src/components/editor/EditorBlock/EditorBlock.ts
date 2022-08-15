import WebComponent from "../../../lib/components/WebComponent";
import html from "./EditorBlock.html";
import FreeTextInputField from "../InputFields/FreeTextInputField/FreeTextInputField";
import { error } from "../../../lib/utils/Logger";

export interface BlockContent {
  title: string;
  inputType: string;
  inputValue: string;
}

export default class EditorBlock extends WebComponent {
  blockContent: BlockContent;

  constructor(blockContent: BlockContent) {
    super(html);
    this.blockContent = blockContent;
  }

  get htmlTagName(): string {
    return "editor-block";
  }

  onInputValueChanged = (newValue: string) => {
    this.blockContent.inputValue = newValue;
  };

  onCreate(): void {
    const title: HTMLSpanElement = this.select(".title")!,
      inputFieldContainer: HTMLDivElement = this.select(
        ".input-field-container"
      )!;

    title.innerHTML = this.blockContent.title;

    switch (this.blockContent.inputType) {
      case "free-text-input-field":
        inputFieldContainer.appendChild(
          new FreeTextInputField(
            this.blockContent.inputValue,
            this.onInputValueChanged
          )
        );
        break;
      default:
        error(`Unknown input type: ${this.blockContent.inputType}`);
    }
  }
}
