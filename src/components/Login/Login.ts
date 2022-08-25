import WebComponent from "../../lib/components/WebComponent";
import html from "../Login/Login.html";
import css from "../Login/Login.css";
import { log } from "../../lib/utils/Logger";
import eventBus from "../../lib/events/EventBus";

export default class Login extends WebComponent {
  $loginButton!: HTMLButtonElement;
  $emailInput!: HTMLInputElement;
  $passwordInput!: HTMLInputElement;

  constructor() {
    super(html, css);
  }

  // override htmlTagName to return the tag name our component
  // -> <example-component /> can be used in the html to create a new instance of this component
  get htmlTagName(): string {
    return "login-register";
  }

  onCreate(): void {
    this.$initHtml();
    this.$loginButton.addEventListener("click", () => {
      this.readInput();
    });
  }

  private $initHtml(): void {
    this.$loginButton = this.select("button")!;
    this.$emailInput = this.select('input[name="email"]')!;
    this.$passwordInput = this.select('input[name="password"]')!;
  }

  readInput(): void {
    log(this.$emailInput.value);
    log(this.$passwordInput.value);
  }
}
