import WebComponent from "../../lib/components/WebComponent";
import html from "../Login/Login.html";
import css from "../Login/Login.css";
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

  /**
   * initializes html elements
   * @private
   */
  private $initHtml(): void {
    this.$loginButton = this.select("button")!;
    this.$emailInput = this.select('input[name="email"]')!;
    this.$passwordInput = this.select('input[name="password"]')!;
    this.$verifyPasswordInput = this.select(".retype-password")!;
    this.$registerToggle = this.select("span")!;
    this.$connectMessage = this.select(".connect-message")!;
    this.$usernameInput = this.select('input[name="username"]')!;
  }

  /**
   * initializes listeners
   * @private
   */
  private initListeners(): void {
    this.$registerToggle.addEventListener("click", this.changeRegisterMode);
    this.$loginButton.addEventListener("click", this.readInput);
  }

  /**
   * called when registerToggle is clicked
   * toggles registerState and sets HTML elements accordingly
   */
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

  /**
   * called when login Button is clicked. will sign in or sign up user depending on registerState
   */
  readInput = async () => {
    if (this.registerState.value) {
      this.signUp();
    } else {
      this.signIn();
    }
  };

  /**
   * sign in user. show message when sign in failed
   */
  signUp = async () => {
    try {
      await DataManager.signUp(
        this.$emailInput.value,
        this.$passwordInput.value,
        this.$usernameInput.value
      );
    } catch (error) {
      if (error instanceof Error) {
        this.showConnectMessage(error.message);
      }
      return;
    }
    window.location.reload();
  };

  /**
   * sign up user. show message when sign up failed
   */
  signIn = async () => {
    let connected = false;
    try {
      connected = await DataManager.signInViaMail(
        this.$emailInput.value,
        this.$passwordInput.value
      );
    } catch (error) {
      if (error instanceof Error) {
        this.showConnectMessage(error.message);
      }
      return;
    }
    if (connected) {
      window.location.reload();
    }
  };

  /**
   * check if user typed in the right password
   */
  checkPassword(): void {
    if (!(this.$passwordInput.value === this.$verifyPasswordInput.value)) {
      this.showConnectMessage("The passwords do not match");
      //this.showConnectMessage("No Account was found");
    }
  }

  /**
   * show message to notify user when sign in / sign up failed
   * @param message
   */
  showConnectMessage(message: string): void {
    this.$connectMessage.innerText = message;
    this.$connectMessage.style.visibility = "visible";
  }
}
