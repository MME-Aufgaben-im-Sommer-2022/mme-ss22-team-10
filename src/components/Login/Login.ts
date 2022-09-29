import WebComponent from "../../lib/components/WebComponent";
import html from "../Login/Login.html";
import css from "../Login/Login.css";
import State from "../../lib/state/State";
import DataManager from "../../data/DataManager";
import { ToastFactory } from "../atomics/Toast/ToastFactory";
import { ToastDuration, ToastType } from "../atomics/Toast/Toast";

export default class Login extends WebComponent {
  private $loginForm!: HTMLDivElement;
  private $loginButton!: HTMLButtonElement;
  private $emailInput!: HTMLInputElement;
  private $usernameInput!: HTMLInputElement;
  private $passwordInput!: HTMLInputElement;
  private $verifyPasswordInput!: HTMLInputElement;
  private $registerToggle!: HTMLSpanElement;
  private $forgotPassword!: HTMLSpanElement;
  private loginState: State<boolean> = new State(true);
  private usernameInputHTML!: string;
  private passwordInputHTML!: string;
  private verifyPasswordInputHTML!: string;

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
    this.$emailInput = this.select(".email")!;
    this.$passwordInput = this.select(".password")!;
    this.$verifyPasswordInput = this.select(".retype-password")!;
    this.$usernameInput = this.select(".username")!;
    this.$registerToggle = this.select(".register-toggle")!;
    this.$forgotPassword = this.select(".forgot-password")!;
    this.usernameInputHTML = this.$usernameInput.outerHTML;
    this.passwordInputHTML = this.$passwordInput.outerHTML;
    this.verifyPasswordInputHTML = this.$verifyPasswordInput.outerHTML;
    this.changeRegisterMode();
  }

  /**
   * initializes listeners
   * @private
   */
  private initListeners(): void {
    this.$registerToggle.addEventListener("click", this.changeRegisterMode);
    this.$forgotPassword.addEventListener("click", this.togglePasswordForgot);
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
    this.$usernameInput = this.select(".username")!;
    this.$verifyPasswordInput.style.visibility = "visible";
    this.$usernameInput.style.visibility = "visible";
  }

  /**
   * called when registerToggle is clicked
   * toggles registerState and sets HTML elements accordingly
   */
  private changeRegisterMode = () => {
    const urlParams = new URLSearchParams(window.location.search),
      userId = urlParams.get("userId");
    if (userId !== null) {
      this.$loginButton.innerText = "set new password";
      this.$registerToggle.classList.add("remove");
      this.$usernameInput.remove();
      this.$emailInput.remove();
      this.$registerToggle.style.visibility = "hidden";
      this.$forgotPassword.style.visibility = "hidden";
      this.$verifyPasswordInput.style.visibility = "visible";
    } else if (this.loginState.value) {
      this.$loginButton.innerText = "Login";
      this.$registerToggle.innerText = "Sign Up";
      this.$verifyPasswordInput.classList.add("remove");
      this.$usernameInput.classList.add("remove");
      this.$forgotPassword.style.visibility = "visible";
      setTimeout(() => {
        this.$verifyPasswordInput.remove();
        this.$usernameInput.remove();
      }, 63);
      this.loginState.value = false;
    } else {
      this.$loginButton.innerText = "Register";
      this.$registerToggle.innerText = "Sign In";
      this.$forgotPassword.style.visibility = "hidden";
      this.createRegisterInputEl();
      this.loginState.value = true;
    }
  };

  /**
   * function for toggling the view between the views for the user's password
   * recovery
   */
  private togglePasswordForgot = () => {
    if (this.$forgotPassword.innerText === "go back") {
      this.$forgotPassword.innerText = "Forgot Password?";
      this.loginState.value = true;
      this.$registerToggle.style.visibility = "visible";
      this.addPasswordInputField();
      this.changeRegisterMode();
    } else {
      this.$loginButton.innerText = "reset password";
      this.$passwordInput.remove();
      this.$registerToggle.style.visibility = "hidden";
      this.$forgotPassword.innerText = "go back";
    }
  };

  /**
   * adds html input element for the password
   */
  private addPasswordInputField = () => {
    const inputElements = document.createElement("div");
    inputElements.innerHTML = this.passwordInputHTML;
    this.$loginForm.insertBefore(
      inputElements.childNodes[0],
      this.$loginForm.children[1]
    );
    this.$passwordInput = this.select(".password")!;
    this.$passwordInput.style.visibility = "visible";
  };

  /**
   * called when login Button is clicked. will sign in or sign up user depending on registerState
   */
  private readInput = async () => {
    if (this.$loginButton.innerText === "set new password") {
      if (this.checkPassword()) {
        this.recoverPassword();
      }
    } else if (this.$loginButton.innerText === "reset password") {
      this.sendPasswordRecoveryLink();
    } else if (!this.loginState.value) {
      this.signIn();
    } else if (this.checkPassword()) {
      this.signUp();
    }
  };

  /**
   * uses the parameters from the recovery link to reset a user's password
   */
  private recoverPassword = async () => {
    const urlParams = new URLSearchParams(window.location.search),
      userId = urlParams.get("userId")!,
      secret = urlParams.get("secret")!;
    try {
      await DataManager.recoverPassword(
        userId,
        secret,
        this.$passwordInput.value
      );
      this.sendToast(
        "Your password has been changed successfully. Please log in to continue.",
        ToastType.Success
      );
      await setTimeout(() => {
        window.location.href = window.location.origin;
      }, 2500);
    } catch (error) {
      if (error instanceof Error) {
        this.sendToast(error.message, ToastType.Error);
        return;
      }
    }
  };

  /**
   * create a password recovery link and send it to the user via mail
   */
  private sendPasswordRecoveryLink = async () => {
    try {
      await DataManager.sendPasswordRecoveryLink(this.$emailInput.value);
      this.sendToast("An Email has been send 📧", ToastType.Info);
      return;
    } catch (error) {
      if (error instanceof Error) {
        this.sendToast(error.message, ToastType.Error);
      }
      return;
    }
  };

  /**
   * sign in user. show message when sign in failed
   */
  private signUp = async () => {
    try {
      await DataManager.signUp(
        this.$emailInput.value,
        this.$passwordInput.value,
        this.$usernameInput.value
      );
    } catch (error) {
      if (error instanceof Error) {
        this.sendToast(error.message, ToastType.Error);
      }
      return;
    }
    window.location.reload();
  };

  /**
   * sign up user. show message when sign up failed
   */
  private signIn = async () => {
    let connected = false;
    try {
      connected = await DataManager.signInViaMail(
        this.$emailInput.value,
        this.$passwordInput.value
      );
    } catch (error) {
      if (error instanceof Error) {
        this.sendToast(error.message, ToastType.Error);
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
  private checkPassword(): boolean {
    if (!(this.$passwordInput.value === this.$verifyPasswordInput.value)) {
      this.sendToast("The passwords do not match", ToastType.Error);
      return false;
    }
    return true;
  }

  /**
   * show message to notify user when sign in / sign up failed
   * @param message
   */
  private sendToast(message: string, toastType: ToastType): void {
    const toastMessage =
      toastType === ToastType.Info
        ? `ℹ️ ${message}!`
        : toastType === ToastType.Success
        ? `✅ ${message}`
        : `⚠️ ${message}`;
    new ToastFactory()
      .setMessage(toastMessage)
      .setType(toastType)
      .setDuration(ToastDuration.Medium)
      .show();
  }
}
