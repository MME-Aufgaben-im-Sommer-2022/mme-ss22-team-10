import WebComponent from "../../../lib/components/WebComponent";
import html from "./LiveTextInput.html";
import EventBus from "../../../lib/events/EventBus";
import { AppEvent } from "../../../lib/events/AppEvent";
import {
  CLOSE_ALL_EDITOR_INPUTS_EVENT,
  CloseAllEditorInputsData,
} from "../../../events/CloseAllEditorInputs";
import State from "../../../lib/state/State";
import css from "./LiveTextInput.css";

/**
 * @class LiveTextInput
 * A text element that can be edited
 */
export default class LiveTextInput extends WebComponent {
  private $textPreview!: HTMLSpanElement;
  private $textInput!: HTMLInputElement;

  private readonly isSingleLine: boolean;
  private readonly textValueState: State<string>;

  /**
   * Creates a new LiveTextInput
   * @param textValueState The state of the text value
   * @param isSingleLine Whether the text input should be single line or not
   */
  constructor(textValueState: State<string>, isSingleLine: boolean) {
    super(html, css);
    this.textValueState = textValueState;
    this.isSingleLine = isSingleLine;
  }

  get htmlTagName(): string {
    return "live-text-input";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListeners();

    if (this.isSingleLine) {
      this.$setSingleLine();
    } else {
      this.$setMultiLine();
    }

    this.toggleMode(true);
  }

  private $initHtml(): void {
    this.$textPreview = this.select(".text-preview")!;
    this.$textInput = this.select(".text-input")!;

    this.$textPreview.innerText = this.textValueState.value;
    this.$textInput.value = this.textValueState.value;
  }

  private $setSingleLine = () => {
    this.$textInput.setAttribute("rows", "1");
    this.$textInput.classList.add("single-line");

    this.$textInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.toggleMode(true);
      }
    });
  };

  private $setMultiLine = () => {
    this.$textInput.classList.add("multi-line");
  };

  private initListeners(): void {
    this.$textPreview.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggleMode(false);
    });
    this.$textInput.addEventListener("click", (event) => {
      event.stopPropagation(); // catch click event so it doesn't propagate to Editor
    });

    // Toggle mode when global event is received
    EventBus.addEventListener(
      CLOSE_ALL_EDITOR_INPUTS_EVENT,
      (event: AppEvent) => this.$onCloseAllEditorInputFields(event.data)
    );
  }

  /**
   * Called, when all other inputs should be closed
   * @param data The data of the event, containing the id of the WebComponent that should not be closed
   */
  private $onCloseAllEditorInputFields = (data: CloseAllEditorInputsData) => {
    if (data.triggerWebComponentId !== this.getWebComponentId()) {
      if (this.$textPreview.hidden) {
        this.toggleMode(true);
      }
    }
  };

  private toggleMode = (doShowTextPreview: boolean) => {
    this.$textPreview.hidden = !doShowTextPreview;
    this.$textInput.hidden = doShowTextPreview;

    if (doShowTextPreview) {
      this.showTextPreview();
    } else {
      this.showTextInput();
    }
  };

  private showTextPreview = () => {
    this.textValueState.value = this.$textInput.value;
    this.$textPreview.innerText = this.textValueState.value;
  };

  private showTextInput = () => {
    this.$textInput.value = this.textValueState.value;
    EventBus.notifyAll(CLOSE_ALL_EDITOR_INPUTS_EVENT, {
      triggerWebComponentId: this.getWebComponentId(),
    });
  };
}
