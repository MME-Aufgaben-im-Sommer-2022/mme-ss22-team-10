import WebComponent from "../../../../lib/components/WebComponent";
import html from "./FreeTextInputField.html";
import State, { StateChangedEventData } from "../../../../lib/state/State";
import { BlockContent } from "../../EditorBlock/EditorBlock";

export default class FreeTextInputField extends WebComponent {
  inputValueState: State<BlockContent>;
  $input!: HTMLInputElement;

  constructor(inputValueState: State<BlockContent>) {
    super(html);
    this.inputValueState = inputValueState;
  }

  get htmlTagName(): string {
    return "free-text-input-field";
  }

  onCreate(): void {
    this.$input = this.select("input")!;
    this.$input.value = this.inputValueState.value.inputValue;

    this.$input.addEventListener("input", this.onInputChanged);
    this.inputValueState.addEventListener("change", (event) =>
      this.onInputValueStateChanged(event.data)
    );
  }

  onInputChanged = (event: Event) => {
    this.inputValueState.value.inputValue = (
      event.target as HTMLInputElement
    ).value;
  };

  private onInputValueStateChanged = (data: StateChangedEventData) => {
    if (data.propertyName === "value.inputValue") {
      if (this.$input.value !== data.newPropertyValue) {
        this.$input.value = data.newPropertyValue ? data.newPropertyValue : "";
      }
    }
  };
}
