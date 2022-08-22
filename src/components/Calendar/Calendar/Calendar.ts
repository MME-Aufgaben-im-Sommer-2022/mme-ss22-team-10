import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/Calendar/Calendar.html";
import css from "../../Calendar/Calendar/Calendar.css";
import CalendarMonth from "../CalendarMonth/CalendarMonth";
import CalendarModel from "../../../data/models/CalendarModel";
import { log } from "../../../lib/utils/Logger";
//import { log } from "../../../lib/utils/Logger";

export default class Calendar extends WebComponent {
  calendarModelPromise: Promise<CalendarModel>;
  calendarMonth: CalendarMonth;
  currentMonthNumber: number;
  currentMonthText: string;
  currentYear: string;
  data: CalendarModel;
  entriesForCurrentMonth: any;
  onNextButtonClicked = false;
  onPreviousButtonClicked = false;

  $monthTitle!: HTMLHeadElement;

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
    this.$initHtml();
    this.initListeners();

    log(this.calendarModelPromise);
    this.calendarModelPromise.then((data) => {
      this.data = data;
      this.getDataForCurrentEntries(this.data);
      this.getEntriesForMonth();
    });
    this.buttonListener();
  }

  private $initHtml(): void {
    this.$monthTitle = this.select(".selector h3")!;
  }

  private initListeners(): void {}

  getDataForCurrentEntries(data: CalendarModel): void {
    this.currentYear = data.today.getFullYear().toString();
    this.currentMonthNumber = data.today.getMonth() + 1;
    this.changeMonthTitle(this.currentMonthNumber);
  }

  changeMonthTitle(monthNumber: number): void {
    let date: Date = new Date();
    date.setMonth(monthNumber - 1);
    this.currentMonthText = date.toLocaleString("default", { month: "long" });
  }

  getEntryData(data: CalendarModel): Array<string> | undefined {
    this.$monthTitle.innerText = this.currentMonthText;
    //log(this.currentYear);
    //log(this.currentMonthNumber);
    //log(data.noteDays[this.currentYear][this.currentMonthNumber]);
    if (
      data.noteDays[this.currentYear][this.currentMonthNumber] !== undefined
    ) {
      return data.noteDays[this.currentYear][this.currentMonthNumber];
    }
    return undefined;
  }

  getEntriesForMonth(): void {
    this.entriesForCurrentMonth = this.getEntryData(this.data);
    this.checkEntries();
  }

  checkEntries(): void {
    if (this.entriesForCurrentMonth !== undefined) {
      this.changeMonthTitle(this.currentMonthNumber);
      //log(this.onNextButtonClicked);
      //log(this.onPreviousButtonClicked);
      this.showEntries();
    } else {
      log("keine Einträge vorhanden" + this.currentMonthNumber);
      this.currentMonthNumber -= 1;
      this.changeMonthTitle(this.currentMonthNumber);
      this.getEntriesForMonth();
    }
  }

  showEntries(): void {
    this.calendarMonth = new CalendarMonth(
      this.entriesForCurrentMonth,
      this.currentMonthText,
      this.currentMonthNumber
    );
    //log(this.calendarMonth);
    if (
      this.onNextButtonClicked === true ||
      this.onPreviousButtonClicked === true
    ) {
      log(this.currentMonthNumber);
      this.removeMonthEntries();
      this.onNextButtonClicked = false;
      this.onPreviousButtonClicked = false;
    }
    this.select(".month")!.append(this.calendarMonth);
  }

  onPreviousClicked = () => {
    this.onPreviousButtonClicked = true;
    //log("previous");
    this.currentMonthNumber -= 1;
    //log(this.currentMonthNumber);
    this.removeMonthEntries();
    this.getEntriesForMonth();
  };

  onNextClicked = () => {
    this.onNextButtonClicked = true;
    //log("next");
    this.currentMonthNumber += 1;
    //log(this.currentMonthNumber);
    this.removeMonthEntries();
    this.getEntriesForMonth();
  };

  buttonListener(): void {
    this.select(".previous")!.addEventListener("click", this.onPreviousClicked);
    this.select(".next")!.addEventListener("click", this.onNextClicked);
  }

  removeMonthEntries(): void {
    log("delete");
    //this.select(".month")!.remove();
  }
}
