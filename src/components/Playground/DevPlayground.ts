import WebComponent from "../../lib/components/WebComponent";
import html from "./DevPlayground.html";
import css from "./DevPlayground.css";

export default class DevPlayground extends WebComponent {
  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
    return "dev-playground";
  }

  onCreate(): void {
    // write your playground code here
    // the dev playground won't be appended in production
  }
}
