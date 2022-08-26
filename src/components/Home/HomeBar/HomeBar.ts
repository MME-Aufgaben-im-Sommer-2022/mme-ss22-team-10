import WebComponent from "../../../lib/components/WebComponent";
import html from "./HomeBar.html";
import css from "./HomeBar.css";
import State from "../../../lib/state/State";
import UserSettingsModel from "../../../data/models/UserSettingsModel";
import DataManager from "../../../data/DataManager";
import EventBus from "../../../lib/events/EventBus";
import { LOGOUT_EVENT } from "../../../events/Logout";

export default class HomeBar extends WebComponent {
  private $greetText!: HTMLSpanElement;
  private $logoutButton!: HTMLButtonElement;

  private userSettingsModelState!: State<UserSettingsModel>;

  constructor() {
    super(html, css);
  }
  get htmlTagName(): string {
    return "home-bar";
  }

  onCreate(): void {
    DataManager.getUserSettingsModel().then((userSettingsModel) => {
      this.userSettingsModelState = new State(userSettingsModel);
      this.$initHtml();
      this.initListener();
    });
  }

  initListener(): void {
    this.$logoutButton.addEventListener("click", this.$onLogoutButtonClicked);
  }

  private $onLogoutButtonClicked = () => {
    EventBus.notifyAll(LOGOUT_EVENT, {});
  };

  $initHtml(): void {
    this.$greetText = this.select("#greet-text")!;
    this.$logoutButton = this.select("#logout-button")!;
    this.$setGreetText();
  }

  $setGreetText(): void {
    this.$greetText.innerHTML = `👋 Hello ${this.userSettingsModelState.value.username}!`;
  }
}
