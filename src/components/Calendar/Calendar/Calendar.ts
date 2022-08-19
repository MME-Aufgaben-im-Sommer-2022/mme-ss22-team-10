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
    //let entriesForCurrentMonth;
    log(this.calendarModelPromise);
    this.calendarModelPromise.then((data) => {
      this.data = data;
      this.getDataForEntries(this.data);
      this.getEntriesForMonth();
    });
    this.buttonListener();
  }

  getDataForEntries(data: CalendarModel): void {
    this.currentMonthText = data.today.toLocaleString("default", {
      month: "long",
    });
    this.currentYear = data.today.getFullYear().toString();
    this.currentMonthNumber = data.today.getMonth() + 1;
  }

  getEntryData(data: CalendarModel): Array<string> | undefined {
    this.select(".selector h3")!.innerText = this.currentMonthText;
    //log(this.currentYear);
    log(this.currentMonthNumber);
    log(data.noteDays[this.currentYear][this.currentMonthNumber]);
    if (
      data.noteDays[this.currentYear][this.currentMonthNumber] !== undefined
    ) {
      return data.noteDays[this.currentYear][this.currentMonthNumber];
    }
    return undefined;
  }

  getEntriesForMonth() {
    this.entriesForCurrentMonth = this.getEntryData(this.data);
    this.checkEntries();
  }

  checkEntries() {
    if (this.entriesForCurrentMonth !== undefined) {
      this.showEntries();
    } else {
      log("undefineddd");
    }
  }

  showEntries() {
    this.calendarMonth = new CalendarMonth(
      this.entriesForCurrentMonth,
      this.currentMonthText,
      this.currentMonthNumber
    );
    log(this.calendarMonth);
    this.select(".month")!.append(this.calendarMonth);
  }

  onPreviousClicked = () => {
    log("previous");
    this.currentMonthNumber -= 1;
    log(this.currentMonthNumber);
    this.getEntriesForMonth();
  };

  onNextClicked = () => {
    log("next");
    this.currentMonthNumber += 1;
    log(this.currentMonthNumber);
    this.getEntriesForMonth();
  };

  buttonListener(): void {
    this.select(".previous")!.addEventListener("click", this.onPreviousClicked);
    this.select(".next")!.addEventListener("click", this.onRemoveButtonClicked);
    //document.querySelector<HTMLDivElement>("button")!.addEventListener("click", this.onRemoveButtonClicked);
  }

  onRemoveButtonClicked() {
    this.select(".month")?.remove();
  }
}
