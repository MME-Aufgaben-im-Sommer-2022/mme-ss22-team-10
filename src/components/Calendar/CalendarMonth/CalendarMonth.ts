import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarMonth/CalendarMonth.html";
import css from "../../Calendar/CalendarMonth/CalendarMonth.css";
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
    for (let i = 1; i <= 30; i++) {
      let date: string;
      if (i < 10) {
        date = "0" + i + ".08";
      } else {
        date = i + ".08";
      }

      this.select(".days")!.append(new CalendarDay(date));
      this.setMonth("August");
    }
  }

  setMonth(month: string): void {
    this.select("h3")!.innerText = month;
  }
}
