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
import UserSettings from "./UserSettings/UserSettings";
import Modal from "../../atomics/Modal/Modal";
import ModalFactory from "../../atomics/Modal/ModalFactory";
import { ToastFactory } from "../../atomics/Toast/ToastFactory";
import { ToastType } from "../../atomics/Toast/Toast";
import { STATE_CHANGE_EVENT } from "../../../events/StateChanged";

export default class HomeBar extends WebComponent {
  private $greetText!: HTMLSpanElement;
  private $logoutButton!: HTMLButtonElement;
  private $userSettingsModal!: Modal<UserSettings>;

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
  $initHtml(): void {
    this.$greetText = this.select("#greet-text")!;
    this.$logoutButton = this.select("#logout-button")!;
    this.$setGreetText();
    this.$userSettingsModal = new ModalFactory<UserSettings>()
      .setContent(new UserSettings())
      .build();
  }

  initListener(): void {
    this.$logoutButton.addEventListener("click", this.$onLogoutButtonClicked);
    this.$greetText.addEventListener("click", this.$onGreetTextClicked);

    this.userSettingsModelState.addEventListener(
      STATE_CHANGE_EVENT,
      this.onUserSettingsChanged
    );
  }

  private $onLogoutButtonClicked = async () => {
    await DataManager.signOut();
    EventBus.notifyAll(LOGOUT_EVENT, {});
    window.location.reload();
  };

  private $onGreetTextClicked = () => {
    this.$userSettingsModal.toggle();
  };

  private onUserSettingsChanged = () => {
    this.$setGreetText();
  };

  $setGreetText(): void {
    this.$greetText.innerHTML = `🌱 Hello ${this.userSettingsModelState.value.username}!`;
  }
}
