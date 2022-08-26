import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarMonth/CalendarMonth.html";
import css from "../../Calendar/CalendarMonth/CalendarMonth.css";
import CalendarDay from "../CalendarDay/CalendarDay";
import { log } from "../../../lib/utils/Logger";

export default class CalendarMonth extends WebComponent {
  entriesForCurrentMonth: Array<string>;
  currentMonthNumber: number;
  currentMonthNumberText!: string;
  currentYear!: string;

  constructor(
    entriesForCurrentMonth: Array<string>,
    currentMonthNumber: number,
    currentYear: string
  ) {
    super(html, css);
    this.entriesForCurrentMonth = entriesForCurrentMonth;
    this.currentMonthNumber = currentMonthNumber;
    this.currentYear = currentYear;
  }

  get htmlTagName(): string {
    return "calendar-month";
  }

  onCreate(): Promise<void> | void {
    log(this.entriesForCurrentMonth);
    this.formatMonth();
    this.appendCalenderEntry();
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
              this.currentMonthNumberText +
              "." +
              this.currentYear
          )
        );
      } else {
        this.select(".days")!.append(
          new CalendarDay(
            this.entriesForCurrentMonth[i] +
              "." +
              this.currentMonthNumberText +
              "." +
              this.currentYear
          )
        );
      }
    }
  }
}
