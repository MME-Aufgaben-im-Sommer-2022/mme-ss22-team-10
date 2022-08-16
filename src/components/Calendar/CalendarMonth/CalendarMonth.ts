import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarMonth/CalendarMonth.html";
import css from "../../Calendar/CalendarMonth/CalendarMonth.css";
import CalendarDay from "../CalendarDay/CalendarDay";
import { log } from "../../../lib/utils/Logger";

export default class CalendarMonth extends WebComponent {
  monthNumber = 0;
  monthText = "";
  day = 0;

  constructor() {
    super(html, css);
  }

  // override htmlTagName to return the tag name our component
  // -> <example-component /> can be used in the html to create a new instance of this component
  get htmlTagName(): string {
    return "calendar-month";
  }

  onCreate(): void {
    const date: Date = new Date();
    this.monthNumber = date.getMonth() + 1;
    this.day = date.getDay();
    this.monthText = date.getUTCMonth().toString();
    for (let i = 1; i <= 30; i++) {
      this.select(".days")!.append(
        new CalendarDay(this.day + "." + this.monthNumber)
      );
      this.setMonth(this.monthNumber);
      this.select(".previous")!.addEventListener(
        "click",
        this.onPreviousClicked
      );
      this.select(".next")!.addEventListener("click", this.onNextClicked);
    }
  }

  onPreviousClicked(): void {
    log("previous");
    this.setMonth(this.monthNumber - 1);
  }

  onNextClicked(): void {
    log("next");
    this.setMonth(this.monthNumber + 1);
  }

  setMonth(monthNumber: number): void {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.monthText = months[monthNumber - 1];
    log(this.monthText);

    this.select("h3")!.innerText = this.monthText;
  }
}
