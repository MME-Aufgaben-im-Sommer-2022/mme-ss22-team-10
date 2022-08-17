import WebComponent from "../../lib/components/WebComponent";
import html from "./Playground.html";
import css from "./Playground.css";
import Calendar from "../Calendar/Calendar/Calendar";

export default class Playground extends WebComponent {
  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
    return "dev-playground";
  }

  onCreate(): void {
    const calendar = new Calendar();
    document.querySelector<HTMLDivElement>("#app")!.append(calendar);
  }
}
