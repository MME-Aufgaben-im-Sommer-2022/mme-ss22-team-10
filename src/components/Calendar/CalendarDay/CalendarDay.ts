import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarDay/CalendarDay.html";
import css from "../../Calendar/CalendarDay/CalendarDay.css";
import { log } from "../../../lib/utils/Logger";

export default class CalendarDay extends WebComponent {
  constructor() {
    super(html, css);
  }

  // override htmlTagName to return the tag name our component
  // -> <example-component /> can be used in the html to create a new instance of this component
  get htmlTagName(): string {
    return "calendar-day";
  }

  onCreate(): void {
    log("IT WORKS");
  }
}
