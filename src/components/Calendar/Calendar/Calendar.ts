import WebComponent from "../../../lib/components/WebComponent";
import State from "../../../lib/state/State";
import ExampleModel from "../../../data/models/ExampleModel";
import html from "../../Calendar/Calendar/Calendar.html";
import css from "../../Calendar/Calendar/Calendar.css";

export default class Calendar extends WebComponent {
  calendarState: State<ExampleModel>;

  constructor(state: State<ExampleModel>) {
    super(html, css);
    this.calendarState = state;
  }

  // override htmlTagName to return the tag name our component
  // -> <example-component /> can be used in the html to create a new instance of this component
  get htmlTagName(): string {
    return "calendartest";
  }

  onCreate(): void {
    this.select("#count")!.innerHTML = `${this.calendarState.value.count}`;
  }
}
