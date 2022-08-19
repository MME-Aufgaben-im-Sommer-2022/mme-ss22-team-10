import WebComponent from "../../../../lib/components/WebComponent";
import html from "./BulletPointInputField.html";
import State from "../../../../lib/state/State";
import LiveTextInput from "../../ListItems/LiveTextInput/LiveTextInput";
import { log } from "../../../../lib/utils/Logger";
import { StateChangedEventData } from "../../../../events/dataTypes/StateChangedEventData";

export default class BulletPointInputField extends WebComponent {
  inputValueState: State<string>;
  bulletPointsState: State<Array<string>>;
  $bulletPointContainer!: HTMLUListElement;

  constructor(inputValueState: State<string>) {
    super(html);
    this.inputValueState = inputValueState;
    this.bulletPointsState = new State<Array<string>>(
      this.inputValueState.value.split("\n")
    );
  }

  get htmlTagName(): string {
    return "bullet-point-input-field";
  }

  onCreate(): void {
    this.$initHtml();
    this.initListeners();
  }

  private initListeners(): void {
    this.bulletPointsState.addEventListener(
      "change",
      this.onBulletPointsStateChanged
    );
    this.inputValueState.addEventListener("change", (event) => {
      log(event);
    });
  }

  private onBulletPointsStateChanged = () => {
    // update the original string state
    this.inputValueState.value = this.bulletPointsState.value.join("\n");
    log("ALL bullet points changed", this.bulletPointsState.value);
  };

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
    const bulletPointState = new State(
        this.bulletPointsState.value[bulletPointIndex]
      ),
      $bulletPoint = new LiveTextInput(bulletPointState);

    bulletPointState.addEventListener("change", (event) => {
      this.bulletPointsState.value[bulletPointIndex] = (
        event.data as StateChangedEventData
      ).newValue;
    });
    return $bulletPoint;
  };
}
