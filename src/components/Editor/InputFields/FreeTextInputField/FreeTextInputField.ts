import WebComponent from "../../../../lib/components/WebComponent";
import html from "./FreeTextInputField.html";
import css from "./FreeTextInputField.css";
import State from "../../../../lib/state/State";
import EventBus from "../../../../lib/events/EventBus";
import {
  CLOSE_ALL_EDITOR_INPUTS_EVENT,
  CloseAllEditorInputsData,
} from "../../../../events/CloseAllEditorInputs";
import { AppEvent } from "../../../../lib/events/AppEvent";
import { log } from "../../../../lib/utils/Logger";

/**
 * @class FreeTextInputField
 * Input field for free text (= a wrapper around LiveTextInput)
 */
export default class FreeTextInputField extends WebComponent {
  private readonly inputValueState: State<string>;

  private $textArea!: HTMLTextAreaElement;

  /**
   * Creates a new FreeTextInputField
   * @param inputValueState The state of the input value
   */
  constructor(inputValueState: State<string>) {
    super(html, css);
    this.inputValueState = inputValueState;
  }

  get htmlTagName(): string {
    return "free-text-input-field";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListeners();
  }

  private $initHtml(): void {
    this.$textArea = this.select(".text-input")!;
    this.$textArea.value = this.inputValueState.value;
  }

  private initListeners(): void {
    this.$textArea.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.toggleActive(false);
      }
    });

    this.$textArea.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggleActive(true);
    });

    EventBus.addEventListener(
      CLOSE_ALL_EDITOR_INPUTS_EVENT,
      (event: AppEvent) => {
        if (
          (event.data as CloseAllEditorInputsData).triggerWebComponentId !==
          this.getWebComponentId()
        ) {
          log(event, this.getWebComponentId());
          this.toggleActive(false);
        }
      }
    );
  }

  private toggleActive(isActive: boolean): void {
    if (isActive) {
      this.$textArea.classList.add("active");
      EventBus.notifyAll(CLOSE_ALL_EDITOR_INPUTS_EVENT, {
        triggerWebComponentId: this.getWebComponentId(),
      });
    } else {
      this.$textArea.classList.remove("active");
      this.$textArea.blur();
      this.inputValueState.value = this.$textArea.value;
    }
  }
}
