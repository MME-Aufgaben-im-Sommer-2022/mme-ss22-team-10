import WebComponent from "../../lib/components/WebComponent";
import html from "../Login/Login.html";
import css from "../Login/Login.css";
import { log } from "../../lib/utils/Logger";
import State from "../../lib/state/State";
import DataManager from "../../data/DataManager";

export default class Login extends WebComponent {
  $loginButton!: HTMLButtonElement;
  $emailInput!: HTMLInputElement;
  $usernameInput!: HTMLInputElement;
  $passwordInput!: HTMLInputElement;
  $verifyPasswordInput!: HTMLInputElement;
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
    this.$verifyPasswordInput = this.select(".retype-password")!;
    this.$registerToggle = this.select("span")!;
    this.$connectMessage = this.select(".connect-message")!;
    this.$usernameInput = this.select('input[name="username"]')!;
  }

  private initListeners(): void {
    this.$registerToggle.addEventListener("click", this.changeRegisterMode);
    this.$loginButton.addEventListener("click", this.readInput);
  }

  changeRegisterMode = () => {
    if (!this.registerState.value) {
      this.$loginButton.innerText = "Register";
      this.$verifyPasswordInput.style.visibility = "visible";
      this.$usernameInput.style.visibility = "visible";
      this.checkPassword();
      this.registerState.value = true;
    } else {
      this.$loginButton.innerText = "Login";
      this.$verifyPasswordInput.style.visibility = "hidden";
      this.$usernameInput.style.visibility = "hidden";
      this.registerState.value = false;
    }
  };

  readInput = async () => {
    if (this.registerState.value) {
      await DataManager.signUp(
        this.$emailInput.value,
        this.$passwordInput.value,
        "testAccountCreation"
      );
      window.location.reload();
    } else {
      const connected = await DataManager.signInViaMail(
        this.$emailInput.value,
        this.$passwordInput.value
      );
      if (connected) {
        window.location.reload();
      }
    }
  };

  checkPassword(): void {
    if (!(this.$passwordInput.value === this.$verifyPasswordInput.value)) {
      this.showConnectMessage("The passwords do not match");
      //this.showConnectMessage("No Account was found");
    }
  }

  showConnectMessage(msg: string): void {
    this.$connectMessage.innerText = msg;
    this.$connectMessage.style.visibility = "visible";
  }
}
