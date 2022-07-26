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
import Modal from "../../atomics/Modal/Modal";
import ModalFactory from "../../atomics/Modal/ModalFactory";
import { STATE_CHANGE_EVENT } from "../../../events/StateChanged";
import UserSettings from "./UserSettings/UserSettings";
import { ToastFactory } from "../../atomics/Toast/ToastFactory";
import { ToastDuration, ToastType } from "../../atomics/Toast/Toast";

/**
 * @class HomeBar
 * The top (nav) bar of the home page
 */
export default class HomeBar extends WebComponent {
  private $greetText!: HTMLSpanElement;
  private $userSettingsModal!: Modal<UserSettings>;
  private $profileIcon!: HTMLDivElement;
  private $profileDropdown!: HTMLDivElement;
  private $logoutOpt!: HTMLSpanElement;
  private $manageAccOpt!: HTMLSpanElement;
  private $username!: HTMLSpanElement;
  private $email!: HTMLSpanElement;

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

  /**
   * set the {@link GlobalState} for the {@link UserSettingsModel user settings} if needed
   * @private
   */
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

  /**
   * initialize html elements
   */
  $initHtml(): void {
    this.$greetText = this.select("#greet-text")!;
    this.$profileIcon = this.select("#profile-icon")!;
    this.$profileDropdown = this.select("#profile-dropdown-menu")!;
    this.$logoutOpt = this.select("#logout-option")!;
    this.$manageAccOpt = this.select("#manage-account")!;
    this.$username = this.select("#username")!;
    this.$email = this.select("#email")!;
    this.$setGreetText();
    this.$setAccInfo();
    this.$userSettingsModal = new ModalFactory<UserSettings>()
      .setContent(new UserSettings())
      .build();
  }

  /**
   * initialize listeners for user related events
   */
  initListener(): void {
    this.$manageAccOpt.addEventListener("click", this.onManageAccOptionClicked);
    this.$logoutOpt.addEventListener("click", this.$onLogoutOptionClicked);
    this.$profileIcon.addEventListener("click", this.$onProfileIconClicked);
    document.addEventListener("click", this.$onFocusOut);
    this.userSettingsModelState.addEventListener(
      STATE_CHANGE_EVENT,
      this.onUserSettingsChanged
    );
  }

  /**
   * sign out the user and show a goodbye message
   */
  private $onLogoutOptionClicked = async () => {
    await DataManager.signOut();
    new ToastFactory()
      .setMessage("👋 Bye bye - see you soon!")
      .setType(ToastType.Info)
      .setDuration(ToastDuration.Short)
      .show();
    EventBus.notifyAll(LOGOUT_EVENT, {});
    setTimeout(() => window.location.reload(), 2000);
  };

  private onManageAccOptionClicked = () => {
    this.$userSettingsModal.toggle();
  };

  private onUserSettingsChanged = () => {
    this.$setGreetText();
  };

  /**
   * set banner title
   */
  $setGreetText(): void {
    this.$greetText.innerHTML = `🌱 Hello ${this.userSettingsModelState.value.username}!`;
  }

  /**
   * retrieve and set account information in the info box
   */
  private $setAccInfo = async () => {
    const accountData = await DataManager.getAccountData();
    this.$email.innerHTML = accountData.email;
    this.$username.innerHTML = `🌱${accountData.name}`;
  };

  /**
   * toggle whether the account info box will be shown or hidden
   */
  private $onProfileIconClicked = () => {
    this.$setAccInfo();
    this.$profileDropdown.classList.toggle("show");
  };

  /**
   * hide the account info box when clicked outside
   */
  private $onFocusOut = () => {
    const target = event!.target;
    if (
      target !== this.$profileIcon &&
      (target === this.$manageAccOpt ||
        !this.$profileDropdown.contains(target as HTMLElement))
    ) {
      this.$profileDropdown.classList.remove("show");
    }
  };
}
