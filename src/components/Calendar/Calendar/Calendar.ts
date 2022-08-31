import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/Calendar/Calendar.html";
import css from "../../Calendar/Calendar/Calendar.css";
import CalendarMonth from "../CalendarMonth/CalendarMonth";
import CalendarModel, { Years } from "../../../data/models/CalendarModel";
import { GlobalStates } from "../../../state/GlobalStates";
import GlobalState from "../../../lib/state/GlobalState";
import DataManager from "../../../data/DataManager";

export default class Calendar extends WebComponent {
  monthNumberDecember = 12;
  monthNumberJanuary = 1;
  yearNumberToStop = 2020;
  calendarMonth!: CalendarMonth;
  currentMonthNumber!: number;
  lastFoundEntries!: number;
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

  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
    return "main-calendar";
  }

  onCreate(): Promise<void> | void {
    return this.initData().then(() => {
      this.$initHtml();
      this.initListeners();
      this.noteDays = this.calendarModel.noteDays;
      this.today = this.calendarModel.today;
      this.getCurrentData();
      this.getEntriesForMonth(false);
    });
  }

  private async initData() {
    if (!GlobalState.hasState(GlobalStates.calendarModel)) {
      const calendarModel = await DataManager.getCalendarModel();
      if (calendarModel) {
        GlobalState.addState(
          calendarModel.toState(),
          GlobalStates.calendarModel
        );
      } else {
        throw new Error("Could not load calendar model");
      }
    }
    // TODO: change this to a state
    this.calendarModel = GlobalState.getStateById<CalendarModel>(
      GlobalStates.calendarModel
    )!.value;
  }

  private $initHtml(): void {
    this.$monthTitle = this.select(".calendar-navigation span")!;
    this.$previousButton = this.select(".previous")!;
    this.$nextButton = this.select(".next")!;
  }

  private initListeners(): void {
    this.$previousButton.addEventListener("click", this.onPreviousClicked);
    this.$nextButton.addEventListener("click", this.onNextClicked);
  }

  private getCurrentData(): void {
    this.currentYearNumber = this.today.getFullYear();
    this.currentYear = this.currentYearNumber.toString();
    this.currentMonthNumber = this.today.getMonth() + 1;
    this.lastFoundEntries = this.today.getMonth() + 1;
  }

  private setMonthTitle(): void {
    const date: Date = new Date(
      `${this.currentMonthNumber}/${1}/${this.currentYear}`
    );
    this.currentMonthText = date.toLocaleString("default", { month: "long" });
    this.$monthTitle.innerText = this.currentMonthText;
  }

  private getEntriesForMonth(directionForward: boolean): void {
    this.checkForYearTransition();
    if (this.currentYearNumber > this.yearNumberToStop) {
      this.entriesForCurrentMonth = this.getEntryData();
      this.setEntries(directionForward);
    } else {
      this.currentMonthNumber = this.lastFoundEntries;
      this.currentYearNumber++;
    }
  }

  private checkForYearTransition(): void {
    if (this.currentMonthNumber < 1) {
      this.currentMonthNumber = this.monthNumberDecember;
      this.currentYearNumber = parseInt(this.currentYear) - 1;
    }
    if (this.currentMonthNumber > this.monthNumberDecember) {
      this.currentMonthNumber = this.monthNumberJanuary;
      this.currentYearNumber = parseInt(this.currentYear) + 1;
    }
    this.currentYear = this.currentYearNumber.toString();
  }

  private getEntryData(): Array<string> {
    const entryData: Array<string> = this.getDaysFromNoteDays();
    if (entryData.length === 0 && this.currentNumbersMatchToday()) {
      entryData.push(this.today.getDate() + "");
    }
    return entryData;
  }

  private getDaysFromNoteDays(): Array<string> {
    let days: Array<string> = [];
    if (
      this.noteDays[this.currentYear] &&
      this.noteDays[this.currentYear][this.currentMonthNumber]
    ) {
      days = this.noteDays[this.currentYear][this.currentMonthNumber];
      this.lastFoundEntries = this.currentMonthNumber;
    }
    return days;
  }

  private currentNumbersMatchToday(): boolean {
    return (
      this.currentMonthNumber === this.today.getMonth() + 1 &&
      this.currentYear === this.today.getFullYear().toString()
    );
  }

  private setEntries(directionForward: boolean): void {
    if (this.entriesForCurrentMonth.length > 0) {
      this.removeMonthEntries();
      this.setMonthTitle();
      this.showEntries();
    } else {
      if (directionForward) {
        this.checkForClickInTheFuture();
      } else {
        this.currentMonthNumber--;
      }
      this.getEntriesForMonth(directionForward);
    }
  }

  private checkForClickInTheFuture(): void {
    if (this.currentYear === this.today.getFullYear().toString()) {
      if (this.currentMonthNumber + 1 <= this.today.getMonth() + 1) {
        this.currentMonthNumber++;
      }
    } else {
      this.currentMonthNumber++;
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
    if (this.currentYearNumber > this.yearNumberToStop) {
      this.currentMonthNumber--;
      this.getEntriesForMonth(false);
    }
  };

  onNextClicked = () => {
    this.checkForClickInTheFuture();
    this.getEntriesForMonth(true);
  };

  removeMonthEntries = () => {
    this.select(".month")!.innerHTML = "";
  };
}
