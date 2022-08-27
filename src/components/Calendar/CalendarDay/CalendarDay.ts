import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarDay/CalendarDay.html";
import css from "../../Calendar/CalendarDay/CalendarDay.css";
import EventBus from "../../../lib/events/EventBus";

export default class CalendarDay extends WebComponent {
  public static CALENDAR_DAY_CLICKED_EVENT = "calendarDayClicked";

  private entryDate;
  $entryTitle!: HTMLHeadElement;

  constructor(entryDate: string) {
    super(html, css);
    this.entryDate = entryDate;
  }

  // override htmlTagName to return the tag name our component
  // -> <example-component /> can be used in the html to create a new instance of this component
  get htmlTagName(): string {
    return "calendar-day";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.$entryTitle.innerText = this.entryDate;
    this.addEventListener("click", () => {
      EventBus.notifyAll(
        CalendarDay.CALENDAR_DAY_CLICKED_EVENT,
        this.entryDate
      );
    });

    this.addEventListener("click", () => {
      EventBus.notifyAll("testColor", this);
    });
  }

  private $initHtml(): void {
    this.$entryTitle = this.select(".date")!;
  }
}
