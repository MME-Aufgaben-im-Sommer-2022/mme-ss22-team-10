import WebComponent from "../../../lib/components/WebComponent";
import html from "./HomeBar.html";
import css from "./HomeBar.css";
import State from "../../../lib/state/State";
import UserSettingsModel from "../../../data/models/UserSettingsModel";
import DataManager from "../../../data/DataManager";
import EventBus from "../../../lib/events/EventBus";
import { LOGOUT_EVENT } from "../../../events/Logout";
import { GlobalStates } from "../../../state/GlobalStates";
import GlobalState from "../../../lib/state/GlobalState";

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

  onCreate(): Promise<void> | void {
    return this.initData().then(() => {
      this.$initHtml();
      this.initListener();
    });
  }

  private async initData() {
    if (!GlobalState.hasState(GlobalStates.userSettingsModel)) {
      const userSettingsModel = await DataManager.getUserSettingsModel();
      if (userSettingsModel) {
        GlobalState.addState(
          userSettingsModel.toState(),
          GlobalStates.userSettingsModel
        );
      } else {
        throw new Error("Could not load user settings model");
      }
    }
    this.userSettingsModelState = GlobalState.getStateById<UserSettingsModel>(
      GlobalStates.userSettingsModel
    )!;
  }

  initListener(): void {
    this.$logoutButton.addEventListener("click", this.$onLogoutButtonClicked);
  }

  private $onLogoutButtonClicked = async () => {
    await DataManager.signOut();
    EventBus.notifyAll(LOGOUT_EVENT, {});
    window.location.reload();
  };

  $initHtml(): void {
    this.$greetText = this.select("#greet-text")!;
    this.$logoutButton = this.select("#logout-button")!;
    this.$setGreetText();
  }

  $setGreetText(): void {
    this.$greetText.innerHTML = `🌱 Hello ${this.userSettingsModelState.value.username}!`;
  }
}
