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

  get htmlTagName(): string {
    return "calendar-day";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.$entryTitle.innerText = this.entryDate;
    this.initListeners();
  }

  private $initHtml(): void {
    this.$entryTitle = this.select(".date")!;
  }

  private initListeners(): void {
    this.addEventListener("click", this.onDayItemClicked);
    EventBus.addEventListener("setColor", this.checkClickedItem);
    this.isSelected.addEventListener("change", this.setColor);
  }

  onDayItemClicked = () => {
    EventBus.notifyAll(CalendarDay.CALENDAR_DAY_CLICKED_EVENT, this.entryDate);
    this.isSelected.value = true;
    EventBus.notifyAll("setColor", this.entryDate);
  };

  checkClickedItem = (event: AppEvent) => {
    if (event.data !== this.entryDate) {
      this.isSelected.value = false;
    }
  };

  setColor = () => {
    if (this.isSelected.value) {
      this.style.background = "var(--text-accent)";
    } else {
      this.style.background = "var(--background-primary)";
    }
  };
}
