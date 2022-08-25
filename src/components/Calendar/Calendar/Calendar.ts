import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/Calendar/Calendar.html";
import css from "../../Calendar/Calendar/Calendar.css";
import CalendarMonth from "../CalendarMonth/CalendarMonth";
import CalendarModel from "../../../data/models/CalendarModel";
import { log } from "../../../lib/utils/Logger";

export default class Calendar extends WebComponent {
  monthNumberDecember = 12;
  calendarModelPromise: Promise<CalendarModel>;
  calendarMonth!: CalendarMonth;
  currentMonthNumber!: number;
  currentMonthText!: string;
  currentYear!: string;
  data!: CalendarModel;
  entriesForCurrentMonth: any;
  currentYearNumber!: number;
  onNextButtonClicked!: boolean;
  $monthTitle!: HTMLHeadElement;
  $previousButton!: HTMLButtonElement;
  $nextButton!: HTMLButtonElement;

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
      this.getDataForFirstEntries(this.data);
      this.setUpFirstEntries();
    });
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

  private setUpFirstEntries() {
    this.entriesForCurrentMonth = this.getEntryData(this.data);
    if (this.entriesForCurrentMonth !== undefined) {
      this.showEntries();
    } else {
      this.createEntry();
    }
  }

  private createEntry(): void {
    const currentDate: Array<string> = [];
    currentDate.push(this.data.today.getDate() + "");
    this.calendarMonth = new CalendarMonth(
      currentDate,
      this.currentMonthNumber,
      this.currentYear
    );
    this.select(".month")!.append(this.calendarMonth);
  }

  private getDataForFirstEntries(data: CalendarModel): void {
    this.currentYear = data.today.getFullYear().toString();
    this.currentMonthNumber = data.today.getMonth() + 1;
    this.changeMonthTitle();
  }

  private changeMonthTitle(): void {
    const date: Date = new Date();
    date.setMonth(this.currentMonthNumber - 1);
    this.currentMonthText = date.toLocaleString("default", { month: "long" });
    this.$monthTitle.innerText = this.currentMonthText;
  }

  private getEntriesForMonth(): void {
    if (this.currentMonthNumber < 1) {
      this.currentMonthNumber = this.monthNumberDecember;
      this.currentYearNumber = parseInt(this.currentYear) - 1;
      this.currentYear = this.currentYearNumber.toString();
    }
    this.entriesForCurrentMonth = this.getEntryData(this.data);
    this.checkEntries();
  }

  private getEntryData(data: CalendarModel): Array<string> | undefined {
    log(data.noteDays[this.currentYear][this.currentMonthNumber]);
    if (
      data.noteDays[this.currentYear][this.currentMonthNumber] !== undefined
    ) {
      return data.noteDays[this.currentYear][this.currentMonthNumber];
    }
    return undefined;
  }

  private checkEntries(): void {
    if (this.entriesForCurrentMonth !== undefined) {
      this.removeMonthEntries();
      this.changeMonthTitle();
      this.showEntries();
    } else {
      if (this.currentMonthNumber === this.data.today.getMonth() + 1) {
        log("currentMonth");
        this.removeMonthEntries();
        this.changeMonthTitle();
        this.createEntry();
      } else if (
        this.currentMonthNumber + 1 <=
        this.data.today.getMonth() + 1
      ) {
        log("next Month smaller= than current");
        this.checkIfNextButtonClicked();
        this.getEntriesForMonth();
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

  private checkIfNextButtonClicked() {
    if (this.onNextButtonClicked) {
      this.currentMonthNumber += 1;
      this.onNextButtonClicked = false;
    } else {
      this.currentMonthNumber -= 1;
    }
  }

  onPreviousClicked = () => {
    this.currentMonthNumber -= 1;
    this.getEntriesForMonth();
  };

  onNextClicked = () => {
    if (this.currentMonthNumber + 1 <= this.data.today.getMonth() + 1) {
      this.onNextButtonClicked = true;
      this.currentMonthNumber += 1;
      this.getEntriesForMonth();
    }
  };

  removeMonthEntries = () => {
    this.select(".month")!.innerHTML = "";
  };
}
