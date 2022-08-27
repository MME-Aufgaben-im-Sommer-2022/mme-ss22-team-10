import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarMonth/CalendarMonth.html";
import css from "../../Calendar/CalendarMonth/CalendarMonth.css";
import CalendarDay from "../CalendarDay/CalendarDay";
import eventBus from "../../../lib/events/EventBus";
import EventBus from "../../../lib/events/EventBus";
import { AppEvent } from "../../../lib/events/AppEvent";
import { log } from "../../../lib/utils/Logger";

export default class CalendarMonth extends WebComponent {
  entriesForCurrentMonth: Array<string>;
  currentMonthNumber: number;
  currentMonthNumberText!: string;
  currentYear!: string;
  $entryContainer!: HTMLHeadElement;

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

  private initListeners(): void {
    EventBus.addEventListener("testColor", (event: AppEvent) => {
      this.colorEntry(event.data);
    });
  }

  onCreate(): Promise<void> | void {
    //log(this.entriesForCurrentMonth);
    this.$initHtml();
    this.initListeners();
    this.formatMonth();
    this.appendCalenderEntry();
  }

  private $initHtml(): void {
    this.$entryContainer = this.select(".entry-container")!;
  }

  private formatMonth(): void {
    if (this.currentMonthNumber < 10) {
      this.currentMonthNumberText = "0" + this.currentMonthNumber;
    } else {
      this.currentMonthNumberText = this.currentMonthNumber.toString();
    }
  }

  private appendCalenderEntry() {
    for (let i = 0; i < this.entriesForCurrentMonth.length; i++) {
      if (parseInt(this.entriesForCurrentMonth[i]) < 10) {
        this.$entryContainer.append(
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
        this.$entryContainer.append(
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

  colorEntry(data: any): void {
    const test = document.querySelectorAll(".calendar-day border");

    for (let i = 0; i < test.length; i++) {
      test[i].style.backgroundColor = "red";
    }
    log(data);
    data.style.background = "blue";
  }
}
