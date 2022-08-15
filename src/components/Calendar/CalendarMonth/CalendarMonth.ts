import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarMonth/CalendarMonth.html";
import css from "../../Calendar/CalendarMonth/CalendarMonth.css";
import { log } from "../../../lib/utils/Logger";
import CalendarDay from "../CalendarDay/CalendarDay";

export default class CalendarMonth extends WebComponent {
  constructor() {
    super(html, css);
  }

  // override htmlTagName to return the tag name our component
  // -> <example-component /> can be used in the html to create a new instance of this component
  get htmlTagName(): string {
    return "calendar-month";
  }

  onCreate(): void {
    log("IT WORKS");
    const calendarDay: CalendarDay = new CalendarDay();
    this.select(".days")!.append(calendarDay);
  }
}
