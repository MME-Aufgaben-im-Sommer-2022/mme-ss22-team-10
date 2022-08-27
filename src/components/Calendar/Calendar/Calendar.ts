import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/Calendar/Calendar.html";
import css from "../../Calendar/Calendar/Calendar.css";
import CalendarMonth from "../CalendarMonth/CalendarMonth";
import CalendarModel, { Years } from "../../../data/models/CalendarModel";
import { log } from "../../../lib/utils/Logger";

export default class Calendar extends WebComponent {
  monthNumberDecember = 12;
  monthNumberJanuary = 1;
  calendarMonth!: CalendarMonth;
  currentMonthNumber!: number;
  currentMonthText!: string;
  currentYear!: string;
  calendarModel!: CalendarModel;
  entriesForCurrentMonth: any;
  currentYearNumber!: number;
  $monthTitle!: HTMLHeadElement;
  $previousButton!: HTMLButtonElement;
  $nextButton!: HTMLButtonElement;
  today!: Date;
  noteDays!: Years;

  constructor(calendarModel: CalendarModel) {
    super(html, css);
    this.calendarModel = calendarModel;
  }

  get htmlTagName(): string {
    return "main-calendar";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListeners();
    this.noteDays = this.calendarModel.noteDays;
    this.today = this.calendarModel.today;
    this.getCurrentData();
    this.getEntriesForMonth(false);
  }

  private $initHtml(): void {
    this.$monthTitle = this.select(".calendar-navigation h3")!;
    this.$previousButton = this.select(".previous")!;
    this.$nextButton = this.select(".next")!;
  }

  private initListeners(): void {
    this.$previousButton.addEventListener("click", this.onPreviousClicked);
    this.$nextButton.addEventListener("click", this.onNextClicked);
  }

  private getCurrentData(): void {
    this.currentYear = this.today.getFullYear().toString();
    this.currentMonthNumber = this.today.getMonth() + 1;
  }

  private changeMonthTitle(): void {
    const date: Date = new Date();
    date.setMonth(this.currentMonthNumber - 1);
    this.currentMonthText = date.toLocaleString("default", { month: "long" });
    this.$monthTitle.innerText = this.currentMonthText;
  }

  private getEntriesForMonth(directionForward: boolean): void {
    if (this.currentMonthNumber < 1 || this.currentMonthNumber > 12) {
      this.changeYearNumber();
    }
    this.entriesForCurrentMonth = this.getEntryData();
    log(this.entriesForCurrentMonth);
    log(this.entriesForCurrentMonth.includes(this.today.getDate()) + "");
    if (
      this.currentMonthNumber === this.today.getMonth() + 1 &&
      !this.entriesForCurrentMonth.includes(this.today.getDate() + "")
    ) {
      //this.entriesForCurrentMonth.push(this.today.getDate() + "");
    }
    this.checkEntries(directionForward);
  }

  private changeYearNumber(): void {
    if (this.currentMonthNumber < 1) {
      this.currentMonthNumber = this.monthNumberDecember;
      this.currentYearNumber = parseInt(this.currentYear) - 1;
    } else {
      this.currentMonthNumber = this.monthNumberJanuary;
      this.currentYearNumber = parseInt(this.currentYear) + 1;
    }
    this.currentYear = this.currentYearNumber.toString();
  }

  private getEntryData(): Array<string> | undefined {
    if (
      this.noteDays[this.currentYear][this.currentMonthNumber] !== undefined
    ) {
      return this.noteDays[this.currentYear][this.currentMonthNumber];
    }
    return new Array<string>();
  }

  private checkEntries(directionForward: boolean): void {
    if (this.entriesForCurrentMonth.length > 0) {
      this.removeMonthEntries();
      this.changeMonthTitle();
      this.showEntries();
    } else {
      if (this.currentMonthNumber + 1 <= this.today.getMonth() + 1) {
        if (directionForward) {
          this.currentMonthNumber += 1;
        } else {
          this.currentMonthNumber -= 1;
        }
        this.getEntriesForMonth(directionForward);
      }
    }
  }

  private showEntries(): void {
    this.calendarMonth = new CalendarMonth(
      this.entriesForCurrentMonth,
      this.currentMonthNumber,
      this.currentYear
    );
    this.select(".month")!.append(this.calendarMonth);
  }

  onPreviousClicked = () => {
    this.currentMonthNumber -= 1;
    this.getEntriesForMonth(false);
  };

  onNextClicked = () => {
    if (this.currentMonthNumber + 1 <= this.today.getMonth() + 1) {
      this.currentMonthNumber += 1;
      this.getEntriesForMonth(true);
    }
  };

  removeMonthEntries = () => {
    this.select(".month")!.innerHTML = "";
  };
}
