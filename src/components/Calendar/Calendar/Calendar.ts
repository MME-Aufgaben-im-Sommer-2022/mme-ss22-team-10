import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/Calendar/Calendar.html";
import css from "../../Calendar/Calendar/Calendar.css";
import CalendarMonth from "../CalendarMonth/CalendarMonth";
import CalendarModel from "../../../data/models/CalendarModel";
import { log } from "../../../lib/utils/Logger";
//import { log } from "../../../lib/utils/Logger";

export default class Calendar extends WebComponent {
  calendarModelPromise: Promise<CalendarModel>;
  currentMonthNumber: number;
  currentMonthText: string;
  currentYear: string;

  constructor(calendarModelPromise: Promise<CalendarModel>) {
    super(html, css);
    this.calendarModelPromise = calendarModelPromise;
  }

  // override htmlTagName to return the tag name our component
  // -> <example-component /> can be used in the html to create a new instance of this component
  get htmlTagName(): string {
    return "main-calendar";
  }

  onCreate(): void {
    let entriesForCurrentMonth;
    log(this.calendarModelPromise);
    this.calendarModelPromise.then((data) => {
      entriesForCurrentMonth = this.getEntriesForMonth(data);
      if (entriesForCurrentMonth !== undefined) {
        const calendarMonth: CalendarMonth = new CalendarMonth(
          entriesForCurrentMonth,
          this.currentMonthText,
          this.currentMonthNumber
        );
        log(calendarMonth);
        this.select(".month")!.append(calendarMonth);
      }
    });
    log("undefineddd");
  }

  getEntriesForMonth(data: CalendarModel): Array<string> | undefined {
    this.currentMonthText = data.today.toLocaleString("default", {
      month: "long",
    });
    this.currentYear = data.today.getFullYear().toString();
    this.currentMonthNumber = data.today.getMonth() + 1;
    //log(this.currentYear);
    //log(this.currentMonthNumber);
    log(data.noteDays[this.currentYear][this.currentMonthNumber]);
    if (
      data.noteDays[this.currentYear][this.currentMonthNumber] !== undefined
    ) {
      return data.noteDays[this.currentYear][this.currentMonthNumber];
    }
    return undefined;
  }
}
