import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/Calendar/Calendar.html";
import css from "../../Calendar/Calendar/Calendar.css";
import CalendarMonth from "../CalendarMonth/CalendarMonth";

export default class Calendar extends WebComponent {
  constructor() {
    super(html, css);
  }

  // override htmlTagName to return the tag name our component
  // -> <example-component /> can be used in the html to create a new instance of this component
  get htmlTagName(): string {
    return "main-calendar";
  }

  onCreate(): void {
    const calendarMonth: CalendarMonth = new CalendarMonth();
    this.select(".month")!.append(calendarMonth);
  }
}
