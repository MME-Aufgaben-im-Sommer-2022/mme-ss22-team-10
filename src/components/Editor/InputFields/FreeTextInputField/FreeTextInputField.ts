import WebComponent from "../../../../lib/components/WebComponent";
import html from "./FreeTextInputField.html";
import State from "../../../../lib/state/State";
import LiveTextInput from "../../../atomics/LiveTextInput/LiveTextInput";

// Input field for free text
// (= a wrapper around LiveTextInput)

// Necessary constructor parameters:
// - inputValueState:
//   - a string, that contains the text to edit
//   - the state is updated the user finishes editing the text

export default class FreeTextInputField extends WebComponent {
  private $inputFieldContainer!: HTMLInputElement;
  private $liveTextInput!: LiveTextInput;

  private readonly inputValueState: State<string>;

  constructor(inputValueState: State<string>) {
    super(html);
    this.inputValueState = inputValueState;
  }

  get htmlTagName(): string {
    return "free-text-input-field";
  }

  onCreate(): void {
    this.$initHtml();
  }

  private $initHtml(): void {
    this.$inputFieldContainer = this.select(
      ".free-text-input-field-container"
    )!;
    this.$liveTextInput = new LiveTextInput(this.inputValueState, false);
    this.$inputFieldContainer.appendChild(this.$liveTextInput);
  }
}
