import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarMonth/CalendarMonth.html";
import css from "../../Calendar/CalendarMonth/CalendarMonth.css";
import CalendarDay from "../CalendarDay/CalendarDay";
import { log } from "../../../lib/utils/Logger";

export default class CalendarMonth extends WebComponent {
  entriesForCurrentMonth: Array<string>;
  currentMonthNumber: number;
  currentMonthNumberText!: string;

  constructor(
    entriesForCurrentMonth: Array<string>,
    currentMonthNumber: number
  ) {
    super(html, css);
    this.entriesForCurrentMonth = entriesForCurrentMonth;
    this.currentMonthNumber = currentMonthNumber;
  }

  // override htmlTagName to return the tag name our component
  // -> <example-component /> can be used in the html to create a new instance of this component
  get htmlTagName(): string {
    return "calendar-month";
  }

  onCreate(): void {
    log(this.entriesForCurrentMonth);
    this.formatMonth();
    this.appendCalenderEntry();

    //this.select(".selector h3")!.innerText = this.currentMonthText;
  }

  formatMonth(): void {
    if (this.currentMonthNumber < 10) {
      this.currentMonthNumberText = "0" + this.currentMonthNumber;
    } else {
      this.currentMonthNumberText = this.currentMonthNumber.toString();
    }
  }

  appendCalenderEntry() {
    for (let i = 0; i < this.entriesForCurrentMonth.length; i++) {
      if (parseInt(this.entriesForCurrentMonth[i]) < 10) {
        this.select(".days")!.append(
          new CalendarDay(
            "0" +
              this.entriesForCurrentMonth[i] +
              "." +
              this.currentMonthNumberText
          )
        );
      } else {
        this.select(".days")!.append(
          new CalendarDay(
            this.entriesForCurrentMonth[i] + "." + this.currentMonthNumberText
          )
        );
      }
    }
  }
}
