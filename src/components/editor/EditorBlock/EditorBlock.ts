import WebComponent from "../../../lib/components/WebComponent";
import html from "./EditorBlock.html";
import FreeTextInputField from "../InputFields/FreeTextInputField/FreeTextInputField";
import State, { StateChangedEventData } from "../../../lib/state/State";
import { AppEvent } from "../../../lib/events/AppEvent";
import { BlockContent } from "../../../data/models/EditorModel";

export default class EditorBlock extends WebComponent {
  blockContentState: State<BlockContent>;

  $title!: HTMLSpanElement;
  $inputFieldContainer!: HTMLDivElement;

  constructor(blockContentState: State<BlockContent>) {
    super(html);
    this.blockContentState = blockContentState;
  }

  get htmlTagName(): string {
    return "editor-block";
  }

  onCreate(): void {
    this.$title = this.select(".title")!;
    this.$inputFieldContainer = this.select(".input-field-container")!;

    this.$title.innerHTML = this.blockContentState.value.title;

    this.blockContentState.addEventListener("change", (event: AppEvent) =>
      this.onBlockContentStateChanged(event.data)
    );

    switch (this.blockContentState.value.inputType) {
      case "free-text-input-field":
        this.$inputFieldContainer.appendChild(
          new FreeTextInputField(this.blockContentState)
        );
        break;
      default:
        throw new Error(
          `Unknown input type: ${this.blockContentState.value.inputType}`
        );
    }
  }

  onBlockContentStateChanged = (data: StateChangedEventData) => {
    if (data.propertyName === "value.title") {
      this.$title.innerHTML = this.blockContentState.value.title;
    } else if (data.propertyName === "value.inputType") {
      // ...
    }
  };
}
