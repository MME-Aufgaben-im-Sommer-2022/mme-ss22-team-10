import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarMonth/CalendarMonth.html";
import css from "../../Calendar/CalendarMonth/CalendarMonth.css";
import CalendarDay from "../CalendarDay/CalendarDay";

export default class CalendarMonth extends WebComponent {
  entriesForCurrentMonth: Array<string>;
  currentWeekDay!: string;
  currentMonthNumberText!: string;
  currentYear!: string;
  currentDate!: Date;
  $entryContainer!: HTMLHeadElement;

  constructor(
    entriesForCurrentMonth: Array<string>,
    currentMonthNumber: number,
    currentYear: string
  ) {
    super(html, css);
    this.entriesForCurrentMonth = entriesForCurrentMonth;
    this.currentMonthNumberText = currentMonthNumber.toString();
    this.currentYear = currentYear;
  }

  get htmlTagName(): string {
    return "calendar-month";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.appendCalenderEntry();
  }

  private $initHtml(): void {
    this.$entryContainer = this.select(".entry-container")!;
  }

  /**
   * gets the currentWeekDay to show in the CalendarDayItem.
   * @param currentDay
   */
  private getWeekDay(currentDay: string) {
    this.currentDate = new Date(
      parseInt(this.currentYear),
      parseInt(this.currentMonthNumberText) - 1,
      parseInt(currentDay)
    );
    this.currentWeekDay = this.currentDate.toLocaleDateString("default", {
      weekday: "short",
    });
  }

  /**
   *adds a CalendarDay-Object to the DOM depending on the retrieved data.
   *adds a "0" to the DayNumber if the DayNumber is smaller than 10.
   */
  private appendCalenderEntry() {
    for (let i = 0; i < this.entriesForCurrentMonth.length; i++) {
      this.getWeekDay(this.entriesForCurrentMonth[i]);
      if (parseInt(this.entriesForCurrentMonth[i]) < 10) {
        this.$entryContainer.append(
          new CalendarDay(
            "0" + this.entriesForCurrentMonth[i] + ", " + this.currentWeekDay,
            this.currentDate
          )
        );
      } else {
        this.$entryContainer.append(
          new CalendarDay(
            this.entriesForCurrentMonth[i] + ", " + this.currentWeekDay,
            this.currentDate
          )
        );
      }
    }
  }
}
