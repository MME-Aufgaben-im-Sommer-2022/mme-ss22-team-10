import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarMonth/CalendarMonth.html";
import css from "../../Calendar/CalendarMonth/CalendarMonth.css";
import CalendarDay from "../CalendarDay/CalendarDay";

export default class CalendarMonth extends WebComponent {
  entriesForCurrentMonth: Array<string>;
  currentWeekDay!: string;
  currentMonthNumberText!: string;
  currentYear!: string;
  $entryContainer!: HTMLHeadElement;

  constructor(entriesForCurrentMonth: Array<string>) {
    super(html, css);
    this.entriesForCurrentMonth = entriesForCurrentMonth;
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
   *adds a CalendarDay-Object to the DOM depending on the retrieved data.
   *adds a "0" to the DayNumber if the DayNumber is smaller than 10.
   */
  private appendCalenderEntry() {
    for (let i = 0; i < this.entriesForCurrentMonth.length; i++) {
      if (parseInt(this.entriesForCurrentMonth[i]) < 10) {
        this.$entryContainer.append(
          new CalendarDay("0" + this.entriesForCurrentMonth[i])
        );
      } else {
        this.$entryContainer.append(
          new CalendarDay(this.entriesForCurrentMonth[i])
        );
      }
    }
  }
}
