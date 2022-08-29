import WebComponent from "../../lib/components/WebComponent";
import html from "../Login/Login.html";
import css from "../Login/Login.css";
import { log } from "../../lib/utils/Logger";
import State from "../../lib/state/State";

export default class Login extends WebComponent {
  $loginButton!: HTMLButtonElement;
  $emailInput!: HTMLInputElement;
  $passwordInput!: HTMLInputElement;
  $retypePasswordInput!: HTMLInputElement;
  $registerToggle!: HTMLLinkElement;
  $connectMessage!: HTMLSpanElement;
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
    this.$retypePasswordInput = this.select(".retype-password")!;
    this.$registerToggle = this.select("span")!;
    this.$connectMessage = this.select(".connect-message");
  }

  private initListeners(): void {
    this.$registerToggle.addEventListener("click", this.changeRegisterMode);
    this.$loginButton.addEventListener("click", this.readInput);
  }

  changeRegisterMode = () => {
    if (!this.registerState.value) {
      this.$loginButton.innerText = "Register";
      this.$retypePasswordInput.style.visibility = "visible";
      this.registerState.value = true;
    } else {
      this.$loginButton.innerText = "Login";
      this.$retypePasswordInput.style.visibility = "hidden";
      this.registerState.value = false;
    }
  };

  readInput = () => {
    this.checkPassword();
  };

  checkPassword(): void {
    if (!(this.$passwordInput.value === this.$retypePasswordInput.value)) {
      this.showConnectMessage("The passwords do not match");
      //this.showConnectMessage("No Account was found");
    }
    //log(this.$emailInput.value);
    //log(this.$passwordInput.value);
  }

  showConnectMessage(msg: string): void {
    this.$connectMessage.innerText = msg;
    this.$connectMessage.style.visibility = "visible";
  }
}
