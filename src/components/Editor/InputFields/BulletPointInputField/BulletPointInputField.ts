import WebComponent from "../../../../lib/components/WebComponent";
import html from "./BulletPointInputField.html";
import State from "../../../../lib/state/State";
import LiveTextInput from "../../atomics/LiveTextInput/LiveTextInput";
import { StateChangedEventData } from "../../../../events/dataTypes/StateChangedEventData";

// Input field for bullet point lists

// Necessary constructor parameters:
// - inputValueState:
//   - a string, that contains all bullet point items, separated by newlines (\n)
//   - the state is updated the user finishes editing an item

export default class BulletPointInputField extends WebComponent {
  private $bulletPointContainer!: HTMLUListElement;

  // the whole list of bullet points as single string, separated by newlines (\n)
  private readonly inputValueState: State<string>;
  // the split up bullet points (e.g. ["item 1", "item 2"])
  private readonly bulletPointsState: State<Array<string>>;

  constructor(inputValueState: State<string>) {
    super(html);
    this.inputValueState = inputValueState;
    this.bulletPointsState = new State<Array<string>>(
      this.inputValueState.value
        .split("\n")
        .map((inputValue) => inputValue.trim())
    );
  }

  get htmlTagName(): string {
    return "bullet-point-input-field";
  }

  onCreate(): void {
    this.$initHtml();
    this.initListeners();
  }

  private $initHtml(): void {
    this.$bulletPointContainer = this.select(".bullet-point-container")!;
    this.$appendBulletPoints();
  }

  private $appendBulletPoints = () => {
    this.bulletPointsState.value.forEach((_, index) => {
      this.$bulletPointContainer.appendChild(this.$createBulletPoint(index));
    });
  };

  private $createBulletPoint = (bulletPointIndex: number): LiveTextInput => {
    // create a new state for each bullet point item
    const bulletPointState = new State(
        this.bulletPointsState.value[bulletPointIndex]
      ),
      $bulletPoint = new LiveTextInput(bulletPointState, true);

    // when one of the new states changes, update the original state
    bulletPointState.addEventListener("change", (event) => {
      this.bulletPointsState.value[bulletPointIndex] = (
        event.data as StateChangedEventData
      ).newValue;
    });
    return $bulletPoint;
  };

  private initListeners(): void {
    this.bulletPointsState.addEventListener(
      "change",
      this.onBulletPointsStateChanged
    );
  }

  private onBulletPointsStateChanged = () => {
    // update the original string state, when an item is changed
    this.inputValueState.value = this.bulletPointsState.value.join("\n");
  };
}
