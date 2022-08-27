import WebComponent from "../../lib/components/WebComponent";
import html from "./Home.html";
import css from "./Home.css";

export default class Home extends WebComponent {
  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
    return "home-component";
  }

  onCreate(): Promise<void> | void {
    // no need to do anything
  }
}
