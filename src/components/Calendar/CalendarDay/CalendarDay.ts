import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarDay/CalendarDay.html";
import css from "../../Calendar/CalendarDay/CalendarDay.css";
import EventBus from "../../../lib/events/EventBus";
import State from "../../../lib/state/State";
import { AppEvent } from "../../../lib/events/AppEvent";

export default class CalendarDay extends WebComponent {
  public static CALENDAR_DAY_CLICKED_EVENT = "calendarDayClicked";

  private entryDate;
  private isSelected = new State(false);
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
      this.isSelected.value = true;
      EventBus.notifyAll("colorTest", this.entryDate);
    });

    EventBus.addEventListener("colorTest", (event: AppEvent) => {
      if (event.data !== this.entryDate) {
        this.isSelected.value = false;
      }
    });

    this.isSelected.addEventListener("change", () => {
      if (this.isSelected.value) {
        this.style.background = "var(--text-accent)";
      } else {
        this.style.background = "var(--background-primary)";
      }
    });
  }

  private $initHtml(): void {
    this.$entryTitle = this.select(".date")!;
  }
}
