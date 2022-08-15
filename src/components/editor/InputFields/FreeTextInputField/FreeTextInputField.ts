import WebComponent from "../../../../lib/components/WebComponent";
import log from "../../../../lib/log/log";

export default class FreeTextInputField extends WebComponent {
  inputValue = "";

  constructor(inputValue: string) {
    super();
    this.inputValue = inputValue;
  }

  get htmlTagName(): string {
    return "free-text-input-field";
  }

  onCreate(): void {
    const input: HTMLInputElement = this.select("input")!;
    input.value = this.inputValue;
    input.addEventListener("input", this.onInputChanged);
  }

  onInputChanged = (event: Event) => {
    log("onInputChanged", event);
    this.inputValue = (event.target as HTMLInputElement).value;
  };
}
