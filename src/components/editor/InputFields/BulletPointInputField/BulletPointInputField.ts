import WebComponent from "../../../../lib/components/WebComponent";
import html from "./BulletPointInputField.html";
import State from "../../../../lib/state/State";
import EditableListItem from "../../EditableListItem/EditableListItem";
import {
  EDITOR_INPUT_FINISH_EDITING_EVENT,
  EditorInputFinishEditingEventData,
} from "../../../../events/dataTypes/EditorInputFinishEditingEventData";

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
    this.inputValueState.value = this.bulletPointsState.value.join("\n");
  };

  private $initHtml(): void {
    this.$bulletPointContainer = this.select(".bullet-point-container")!;
    this.$appendBulletPoints();
  }

  private $appendBulletPoints = () => {
    this.bulletPointsState.value.forEach((bulletPoint, index) => {
      this.$bulletPointContainer.appendChild(
        this.$createBulletPoint(bulletPoint, index)
      );
    });
  };

  private $createBulletPoint = (
    bulletPoint: string,
    index: number
  ): EditableListItem => {
    const $bulletPoint = new EditableListItem(bulletPoint);
    $bulletPoint.addEventListener(
      EDITOR_INPUT_FINISH_EDITING_EVENT,
      (event: Event) => {
        const data = (event as CustomEvent)
          .detail as EditorInputFinishEditingEventData;
        this.bulletPointsState.value[index] = data.newInputValue;
      }
    );
    return $bulletPoint;
  };
}
