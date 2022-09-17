import WebComponent from "../../lib/components/WebComponent";
import html from "../Login/Login.html";
import css from "../Login/Login.css";
import State from "../../lib/state/State";
import DataManager from "../../data/DataManager";
import { ToastFactory } from "../atomics/Toast/ToastFactory";
import { ToastDuration, ToastType } from "../atomics/Toast/Toast";

export default class Login extends WebComponent {
  $loginForm!: HTMLDivElement;
  $loginButton!: HTMLButtonElement;
  $emailInput!: HTMLInputElement;
  $usernameInput!: HTMLInputElement;
  $passwordInput!: HTMLInputElement;
  $verifyPasswordInput!: HTMLInputElement;
  $registerToggle!: HTMLLinkElement;
  loginState: State<boolean> = new State(true);
  usernameInputHTML!: string;
  verifyPasswordInputHTML!: string;

  constructor() {
    super(html, css);
  }

  /**
   * override htmlTagName to return the tag name our component
   * @example <example-component /> can be used in the html to create a new instance of this component
   */
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
    this.$loginForm = this.select(".login-form")!;
    this.$loginButton = this.select("button")!;
    this.$emailInput = this.select('input[name="email"]')!;
    this.$passwordInput = this.select('input[name="password"]')!;
    this.$verifyPasswordInput = this.select(".retype-password")!;
    this.$usernameInput = this.select('input[name="username"]')!;
    this.usernameInputHTML = this.$usernameInput.outerHTML;
    this.verifyPasswordInputHTML = this.$verifyPasswordInput.outerHTML;
    this.$registerToggle = this.select("span")!;
    this.changeRegisterMode();
  }

  /**
   * initializes listeners
   * @private
   */
  private initListeners(): void {
    this.$registerToggle.addEventListener("click", this.changeRegisterMode);
    this.$loginButton.addEventListener("click", this.readInput);
  }

  private createRegisterInputEl(): void {
    const inputElements = document.createElement("div");
    inputElements.innerHTML = (
      this.usernameInputHTML +
      "\n" +
      this.verifyPasswordInputHTML
    ).trim();
    this.$loginForm.insertBefore(
      inputElements.childNodes[0],
      this.$loginForm.children[0]
    );
    this.$loginForm.insertBefore(
      inputElements.childNodes[1],
      this.$loginForm.children[3]
    );
    this.$verifyPasswordInput = this.select(".retype-password")!;
    this.$usernameInput = this.select('input[name="username"]')!;
    this.$verifyPasswordInput.style.visibility = "visible";
    this.$usernameInput.style.visibility = "visible";
  }

  /**
   * called when registerToggle is clicked
   * toggles registerState and sets HTML elements accordingly
   */
  changeRegisterMode = () => {
    if (this.loginState.value) {
      this.$loginButton.innerText = "Login";
      this.$registerToggle.innerText = "Sign Up";
      this.$verifyPasswordInput.classList.add("remove");
      this.$usernameInput.classList.add("remove");
      setTimeout(() => {
        this.$verifyPasswordInput.remove();
        this.$usernameInput.remove();
      }, 63);
      this.loginState.value = false;
    } else {
      this.$loginButton.innerText = "Register";
      this.$registerToggle.innerText = "Sign In";
      this.createRegisterInputEl();
      this.loginState.value = true;
    }
  };

  /**
   * called when login Button is clicked. will sign in or sign up user depending on registerState
   */
  readInput = async () => {
    if (!this.loginState.value) {
      this.signIn();
    } else if (this.checkPassword()) {
      this.signUp();
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
        this.sendToast(error.message);
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
        this.sendToast(error.message);
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
  checkPassword(): boolean {
    if (!(this.$passwordInput.value === this.$verifyPasswordInput.value)) {
      this.sendToast("The passwords do not match");
      return false;
    }
    return true;
  }

  /**
   * show message to notify user when sign in / sign up failed
   * @param message
   */
  sendToast(message: string): void {
    new ToastFactory()
      .setMessage(`⚠️ ${message}!`)
      .setType(ToastType.Error)
      .setDuration(ToastDuration.Medium)
      .show();
  }
}
