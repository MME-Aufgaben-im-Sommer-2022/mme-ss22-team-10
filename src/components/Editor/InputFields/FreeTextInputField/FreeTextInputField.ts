import WebComponent from "../../../../lib/components/WebComponent";
import html from "./FreeTextInputField.html";
import State from "../../../../lib/state/State";

export default class FreeTextInputField extends WebComponent {
  inputValueState: State<string>;
  $input!: HTMLInputElement;

  constructor(inputValueState: State<string>) {
    super(html);
    this.inputValueState = inputValueState;
  }

  get htmlTagName(): string {
    return "free-text-input-field";
  }

  onCreate(): void {
    this.$initHtml();
    this.initListeners();
  }

  private $initHtml(): void {
    this.$input = this.select("input")!;
    this.$input.value = this.inputValueState.value;
  }

  private initListeners(): void {
    this.$input.addEventListener("input", this.$onInputChanged);
  }

  private $onInputChanged = (event: Event) => {
    this.inputValueState.value = (event.target as HTMLInputElement).value;
  };
}
