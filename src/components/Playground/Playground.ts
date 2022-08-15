import WebComponent from "../../lib/components/WebComponent";
import html from "./Playground.html";
import css from "./Playground.css";

export default class Playground extends WebComponent {
  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
    return "dev-playground";
  }

  onCreate(): void {
    // write your playground code here
    // the dev playground won't be appended in psssroduction
  }
}
