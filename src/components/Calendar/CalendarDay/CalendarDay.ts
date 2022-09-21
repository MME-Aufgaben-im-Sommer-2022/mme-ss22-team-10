import WebComponent from "../../../lib/components/WebComponent";
import html from "../../Calendar/CalendarDay/CalendarDay.html";
import css from "../../Calendar/CalendarDay/CalendarDay.css";
import EventBus from "../../../lib/events/EventBus";
import State from "../../../lib/state/State";
import { AppEvent } from "../../../lib/events/AppEvent";

export default class CalendarDay extends WebComponent {
  public static CALENDAR_DAY_CLICKED_EVENT = "calendarDayClicked";

  private entryDate;
  private currentDate;
  private isSelected = new State(false);
  $entryTitle!: HTMLHeadElement;

  constructor(entryDate: string, currentDate: Date) {
    super(html, css);
    this.entryDate = entryDate;
    this.currentDate = currentDate;
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

  /**
   * sets isSelected to true and informs the listeners.
   */
  onDayItemClicked = () => {
    EventBus.notifyAll(
      CalendarDay.CALENDAR_DAY_CLICKED_EVENT,
      this.currentDate
    );
    this.isSelected.value = true;
    EventBus.notifyAll("setColor", this.entryDate);
  };

  /**
   * sets isSelected to false if the clicked DayItem isn't the currentDayItem
   */
  checkClickedItem = (event: AppEvent) => {
    if (event.data !== this.entryDate) {
      this.isSelected.value = false;
    }
  };

  /**
   * sets the color of the dayItem depending on whether it was clicked or not.
   */
  setColor = () => {
    if (this.isSelected.value) {
      this.style.background = "var(--text-accent)";
    } else {
      this.style.background = "var(--background-primary)";
    }
  };
}
