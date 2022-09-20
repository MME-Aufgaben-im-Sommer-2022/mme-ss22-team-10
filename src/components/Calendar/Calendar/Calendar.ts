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
  yearNumberToStop!: number;
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

  /**
   * gets the current date like current month, current year.
   */
  private getCurrentData(): void {
    this.currentYearNumber = this.today.getFullYear();
    this.currentYear = this.currentYearNumber.toString();
    this.currentMonthNumber = this.today.getMonth() + 1;
    this.lastFoundEntries = this.today.getMonth() + 1;
  }

  /**
   * Sets the month title to match the current month the user is currently in.
   */
  private setMonthTitle(): void {
    const date: Date = new Date(
      `${this.currentMonthNumber}/${1}/${this.currentYear}`
    );
    this.currentMonthText = date.toLocaleString("default", { month: "long" });
    this.$monthTitle.innerText = this.currentMonthText + " " + this.currentYear;
  }

  /**
   * calculates the year in which there are no more entries.
   */
  private getMinYearNumber() {
    this.yearNumberToStop = this.currentYearNumber;
    while (this.noteDays[this.yearNumberToStop] !== undefined) {
      this.yearNumberToStop--;
    }
  }

  /**
   * checks if the year has changed and gets the year number in which there are no more entries. After that, it is
   * checked if the year number in the application is bigger than the yearNumberToStop. If that's the case,
   * the getEntryData method is called to get the string array with the entries. Then the setEntries method is called.
   * If the user reached the yearNumberToStop, the lastFoundEntries is set to the currentMonthNumber and the
   * currentYearNumber is increased by one.
   * @param directionForward - tells us, if the user has clicked the next or previous button.
   */
  private getEntriesForMonth(directionForward: boolean): void {
    this.checkForYearTransition();
    this.getMinYearNumber();
    if (this.currentYearNumber > this.yearNumberToStop) {
      this.entriesForCurrentMonth = this.getEntryData();
      this.setEntries(directionForward);
    } else {
      this.currentMonthNumber = this.lastFoundEntries;
      this.currentYearNumber++;
    }
  }

  /**
   * checks if the currentMonthNumber is smaller than 1 oder bigger than 12. In both cases there is a year transition.
   * If that's the case, The currentMonthNumber is set either to 1 for January or to 12 for December.
   */
  private checkForYearTransition(): void {
    if (this.currentMonthNumber < this.monthNumberJanuary) {
      this.currentMonthNumber = this.monthNumberDecember;
      this.currentYearNumber = parseInt(this.currentYear) - 1;
    }
    if (this.currentMonthNumber > this.monthNumberDecember) {
      this.currentMonthNumber = this.monthNumberJanuary;
      this.currentYearNumber = parseInt(this.currentYear) + 1;
    }
    this.currentYear = this.currentYearNumber.toString();
  }

  /**
   * gets the entries by calling the getDaysFromNoteDays method. After that it is checked if an empty array was
   * returned and if the user is currently in the current month. If both are the case, today's date is added to
   * the array as an entry.
   * @return string-Array with the entries.
   */
  private getEntryData(): Array<string> {
    const entryData: Array<string> = this.getDaysFromNoteDays();
    if (entryData.length === 0 && this.currentNumbersMatchToday()) {
      entryData.push(this.today.getDate() + "");
    }
    return entryData;
  }

  /**
   * If there are entries for the current month and year in which the user is currently located in the application,
   * they will be returned as a string array. If there are no entries, an empty string array is returned.
   */
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

  /**
   * checks if the year and month the user is in the application is the current one.
   */
  private currentNumbersMatchToday(): boolean {
    return (
      this.currentMonthNumber === this.today.getMonth() + 1 &&
      this.currentYear === this.today.getFullYear().toString()
    );
  }

  /**
   * the method checks if the array with entries is empty. If yes, it is checked if the user clicked the next or
   * previous button. When the user clicked the next button, it will be checked if the next month is in the future or not.
   * If the user clicked the previous button the currentMonthNumber is decreased by one.
   * If the array isn't empty, the current entries from the DOM will be deleted, the new monthTitle is set and the
   * entries will be added to the DOM.
   * @param directionForward - tells us, if the user has clicked the next or previous button.
   */
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

  /**
   * This method first checks if the year number the user is currently in matches the current one. If this
   * is not the case, the month number is simply increased by one, since a click into the future cannot occur here.
   * If this is the case, it will be checked if the current month plus one is a month that is still in the future.
   * If it is, nothing happens, otherwise the current month number is simply increased by one.
   */
  private checkForClickInTheFuture(): void {
    if (this.currentYear === this.today.getFullYear().toString()) {
      if (this.currentMonthNumber + 1 <= this.today.getMonth() + 1) {
        this.currentMonthNumber++;
      }
    } else {
      this.currentMonthNumber++;
    }
  }

  /**
   * adds new entries to the DOM.
   */
  private showEntries(): void {
    this.calendarMonth = new CalendarMonth(
      this.entriesForCurrentMonth,
      this.currentMonthNumber,
      this.currentYear
    );
    this.select(".month")!.append(this.calendarMonth);
  }

  /**
   * If the user has clicked on the previous button, it will check if the year number the user is currently in is greater than the year
   * number where it should not go further back. If it is, the current month number is reduced by one and the
   * getEntriesForMonth method is called. This is passed false because the direction is not forward but back.
   */
  onPreviousClicked = () => {
    if (this.currentYearNumber > this.yearNumberToStop) {
      this.currentMonthNumber--;
      this.getEntriesForMonth(false);
    }
  };

  /**
   * If the user clicked on the next button, the checkForClickInTheFuture method is called. This checks whether this
   * click would call a month that does not yet exist because it is in the future. Then the getEntriesForMonth method
   * is called. This is passed true, because the direction is forward and not backward.
   */
  onNextClicked = () => {
    this.checkForClickInTheFuture();
    this.getEntriesForMonth(true);
  };

  /**
   * removes all current entries from the entry-container.
   */
  removeMonthEntries = () => {
    this.select(".month")!.innerHTML = "";
  };
}
