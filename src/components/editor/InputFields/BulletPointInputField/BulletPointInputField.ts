import WebComponent from "../../../../lib/components/WebComponent";
import html from "./BulletPointInputField.html";
import State from "../../../../lib/state/State";
import EditableListItem from "../../ListItems/EditableListItem/EditableListItem";
import { log } from "../../../../lib/utils/Logger";

export default class BulletPointInputField extends WebComponent {
  inputValueState: State<string>;
  bulletPointsState: State<Array<string>>;
  $bulletPointContainer!: HTMLInputElement;

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

  private $createBulletPoint = (bulletPointIndex: number): EditableListItem => {
    const bulletPointState = this.bulletPointsState.createSubState(
        `value.${bulletPointIndex}`
      ),
      $bulletPoint = new EditableListItem(bulletPointState);

    bulletPointState.addEventListener("change", (event) => {
      log("SINGLE bullet point changed", event.data);
    });
    return $bulletPoint;
  };
}
