import WebComponent from "../../../../lib/components/WebComponent";
import html from "./FreeTextInputField.html";

export default class FreeTextInputField extends WebComponent {
  initialValue = "";
  onInputValueChanged: (newValue: string) => void;

  constructor(
    initialValue: string,
    onInputValueChanged: (newValue: string) => void
  ) {
    super(html);
    this.initialValue = initialValue;
    this.onInputValueChanged = onInputValueChanged;
  }

  get htmlTagName(): string {
    return "free-text-input-field";
  }

  onCreate(): void {
    const input: HTMLInputElement = this.select("input")!;
    input.value = this.initialValue;
    input.addEventListener("input", this.onInputChanged);
  }

  onInputChanged = (event: Event) => {
    this.onInputValueChanged((event.target as HTMLInputElement).value);
  };
}
