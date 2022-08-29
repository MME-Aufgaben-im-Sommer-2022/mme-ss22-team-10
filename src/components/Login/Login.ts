import WebComponent from "../../lib/components/WebComponent";
import html from "../Login/Login.html";
import css from "../Login/Login.css";
import { log } from "../../lib/utils/Logger";
import State from "../../lib/state/State";
import DataManager from "../../data/DataManager";

export default class Login extends WebComponent {
  $loginButton!: HTMLButtonElement;
  $emailInput!: HTMLInputElement;
  $passwordInput!: HTMLInputElement;
  $registerToggle!: HTMLLinkElement;
  registerState: State<boolean> = new State(false);

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
    this.initListeners();
  }

  private $initHtml(): void {
    this.$loginButton = this.select("button")!;
    this.$emailInput = this.select('input[name="email"]')!;
    this.$passwordInput = this.select('input[name="password"]')!;
    this.$registerToggle = this.select("a")!;
  }

  private initListeners(): void {
    this.$registerToggle.addEventListener("click", this.changeRegisterMode);
    this.$loginButton.addEventListener("click", this.readInput);
  }

  changeRegisterMode = () => {
    if (!this.registerState.value) {
      this.$loginButton.innerText = "Register";
      this.registerState.value = true;
    } else {
      this.$loginButton.innerText = "Login";
      this.registerState.value = false;
    }
  };

  readInput = async () => {
    this.registerState.value = await DataManager.signInViaMail(
      this.$emailInput.value,
      this.$passwordInput.value
    );
    if (this.registerState.value) {
      window.location.reload();
    }
  };
}
