import WebComponent from "../../../../lib/components/WebComponent";
import html from "./BulletPointInputField.html";
import State from "../../../../lib/state/State";
import { StateChangedData } from "../../../../events/StateChanged";
import LiveBulletPointItem from "../../../atomics/LiveBulletPointItem/LiveBulletPointItem";

// Input field for bullet point lists

// Necessary constructor parameters:
// - inputValueState:
//   - a string, that contains all bullet point items, separated by newlines (\n)
//   - the state is updated the user finishes editing an item

export default class BulletPointInputField extends WebComponent {
  private $bulletPointContainer!: HTMLUListElement;
  private $newBulletPointInputContainer!: HTMLLIElement;
  private $newBulletPointInput!: HTMLInputElement;

  // the whole list of bullet points as single string, separated by newlines (\n)
  private readonly bulletPointsListState: State<string>;
  // the split up bullet points (e.g. ["item 1", "item 2"])
  private readonly bulletPointsState: State<Array<string>>;

  constructor(bulletPointsListState: State<string>) {
    super(html);
    this.bulletPointsListState = bulletPointsListState;
    this.bulletPointsState = new State<Array<string>>([]);
    this.bulletPointsListState.value.split("\n").forEach((inputValue) => {
      const value = inputValue.trim();
      if (value !== "") {
        this.bulletPointsState.value.push(value);
      }
    });
  }

  get htmlTagName(): string {
    return "bullet-point-input-field";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListeners();
  }

  private $initHtml(): void {
    this.$bulletPointContainer = this.select(".bullet-point-container")!;
    this.$newBulletPointInputContainer = this.select(
      ".new-bullet-point-input-container"
    )!;
    this.$newBulletPointInput = this.select(".new-bullet-point-input")!;
    this.$appendBulletPoints();
  }

  private $appendBulletPoints = () => {
    this.bulletPointsState.value.forEach((_, index) => {
      this.$bulletPointContainer.insertBefore(
        this.$createBulletPoint(index),
        this.$newBulletPointInputContainer
      );
    });
  };

  private $createBulletPoint = (
    bulletPointIndex: number
  ): LiveBulletPointItem => {
    // create a new state for each bullet point item
    const bulletPointTextValueState = new State(
        this.bulletPointsState.value[bulletPointIndex]
      ),
      $bulletPoint = new LiveBulletPointItem(bulletPointTextValueState);

    // when one of the new states changes, update the original state
    bulletPointTextValueState.addEventListener("change", (event) => {
      const data = event.data as StateChangedData;
      if (data.newValue === "") {
        $bulletPoint.remove();
      }
      this.bulletPointsState.value[bulletPointIndex] = (
        event.data as StateChangedData
      ).newValue;
    });
    return $bulletPoint;
  };

  private initListeners(): void {
    this.$newBulletPointInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.$addNewBulletPointItem();
      }
    });

    this.bulletPointsState.addEventListener(
      "change",
      this.onBulletPointsStateChanged
    );
  }

  private onBulletPointsStateChanged = () => {
    // update the original string state, when an item is changed
    this.bulletPointsListState.value = this.bulletPointsState.value
      .filter((value) => value.trim() !== "")
      .join("\n");
  };

  private $addNewBulletPointItem = () => {
    const newBulletPoint = this.$newBulletPointInput.value.trim();
    if (newBulletPoint.length > 0) {
      this.bulletPointsState.value.push(newBulletPoint);
      this.$bulletPointContainer.insertBefore(
        this.$createBulletPoint(this.bulletPointsState.value.length - 1),
        this.$newBulletPointInputContainer
      );
      this.$newBulletPointInput.value = "";
    }
  };
}
