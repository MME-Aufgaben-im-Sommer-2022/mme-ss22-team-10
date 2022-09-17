import WebComponent from "../../../lib/components/WebComponent";
import State from "../../../lib/state/State";
import html from "./LiveBulletPointItem.html";
import LiveTextInput from "../LiveTextInput/LiveTextInput";

/**
 * @class LiveBulletPointItem
 * A bullet point item that can be edited
 */
export default class LiveBulletPointItem extends WebComponent {
  private $liveTextInputContainer!: HTMLLIElement;
  private $liveTextInput!: LiveTextInput;

  private readonly textValueState: State<string>;

  /**
   * Creates a new LiveBulletPointItem
   * @param textValueState The state of the text value
   */
  constructor(textValueState: State<string>) {
    super(html);
    this.textValueState = textValueState;
  }

  get htmlTagName(): string {
    return "live-bullet-point-item";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
  }

  private $initHtml(): void {
    this.classList.add("list-item");
    this.classList.add("editor-atomic-item");
    this.$liveTextInputContainer = this.select(".live-text-input-container")!;
    this.$liveTextInput = new LiveTextInput(this.textValueState, true);
    this.$liveTextInputContainer.appendChild(this.$liveTextInput);
  }
}
