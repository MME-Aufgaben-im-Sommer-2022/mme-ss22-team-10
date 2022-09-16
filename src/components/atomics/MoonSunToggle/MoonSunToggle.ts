import WebComponent from "../../../lib/components/WebComponent";
import html from "./MoonSunToggle.html";
import css from "./MoonSunToggle.css";

export default class MoonSunToggle extends WebComponent {
  private $toggle!: HTMLDivElement;

  constructor() {
    super(html, css);
  }

  onCreate(): void | Promise<void> {
    this.$initHtml();
    this.initListener();
  }

  get htmlTagName(): string {
    return "moon-sun-toggle";
  }

  private $initHtml(): void {
    this.$toggle = this.select(".darkmode-toggle")!;
  }

  private initListener(): void {}
}
