import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarDay/CalendarDay.html";
import css from "../../Calendar/CalendarDay/CalendarDay.css";

export default class CalendarDay extends WebComponent {
  entryDate;

  constructor(entryDate: string) {
    super(html, css);
    this.entryDate = entryDate;
  }

  // override htmlTagName to return the tag name our component
  // -> <example-component /> can be used in the html to create a new instance of this component
  get htmlTagName(): string {
    return "calendar-day";
  }

  onCreate(): void {
    this.select("h3")!.innerText = this.entryDate;
  }

  // ToDo: Methode, die zurückgibt, ob es geklickt wurde und wenn ja ihr Datum zurückgibt
}
