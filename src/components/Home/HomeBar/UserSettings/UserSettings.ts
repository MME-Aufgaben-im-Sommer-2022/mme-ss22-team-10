import WebComponent from "../../../../lib/components/WebComponent";
import html from "./UserSettings.html";
import css from "./UserSettings.css";
import { ToastFactory } from "../../../atomics/Toast/ToastFactory";
import { ToastDuration, ToastType } from "../../../atomics/Toast/Toast";
import UserSettingsModel from "../../../../data/models/UserSettingsModel";
import GlobalState from "../../../../lib/state/GlobalState";
import { GlobalStates } from "../../../../state/GlobalStates";
import State from "../../../../lib/state/State";
import Modal, { ModalContent } from "../../../atomics/Modal/Modal";
import DataManager from "../../../../data/DataManager";

/**
 * @class UserSettings
 * Component to configure the user settings, such as
 * - password
 * - email
 * - username
 */
export default class UserSettings extends WebComponent implements ModalContent {
  private userSettingsModelState: State<UserSettingsModel>;
  private $newUsernameInput!: HTMLInputElement;
  private $newEmailInput!: HTMLInputElement;
  private $newPasswordInput!: HTMLInputElement;
  private $confirmNewPasswordInput!: HTMLInputElement;
  private $currentPasswordInput!: HTMLInputElement;
  private $cancelButton!: HTMLButtonElement;
  private $saveButton!: HTMLButtonElement;
  private accountData!: { email: string; username: string };

  private didSave = false;

  constructor() {
    super(html, css);
    this.userSettingsModelState = GlobalState.getStateById(
      GlobalStates.userSettingsModel
    )!;
  }

  onCreate(): void | Promise<void> {
    this.$initHtml();
    this.initListener();
  }

  private $initHtml(): void {
    ["slide-down-in", "floating-container"].forEach((c) =>
      this.classList.add(c)
    );
    this.$newUsernameInput = this.select("#new-username-input")!;
    this.$newEmailInput = this.select("#new-email-input")!;
    this.$newPasswordInput = this.select("#new-password-input")!;
    this.$confirmNewPasswordInput = this.select("#confirm-new-password-input")!;
    this.$currentPasswordInput = this.select("#current-password-input")!;
    this.$cancelButton = this.select("#cancel-button")!;
    this.$saveButton = this.select("#save-button")!;
    this.$setUserSettingsFormula();
  }

  private setAccountData = async () => {
    this.accountData = {
      email: "",
      username: "",
    };
    const data = await DataManager.getAccountData();
    this.accountData.email = data.email;
    this.accountData.username = data.name;
  };

  private $setUserSettingsFormula = async () => {
    await this.setAccountData();
    this.$newEmailInput.value = this.accountData.email;
    this.$newUsernameInput.value = this.accountData.username;
    this.$currentPasswordInput.value = "";
    this.$newPasswordInput.value = "";
    this.$confirmNewPasswordInput.value = "";
  };

  private initListener(): void {
    this.$cancelButton.addEventListener("click", this.$onCancelClicked);
    this.$saveButton.addEventListener("click", this.$onSaveClicked);
  }

  private $onCancelClicked = (): void => {
    this.close(false);
  };

  private $onSaveClicked = async (): Promise<void> => {
    const newUsername = this.$newUsernameInput.value,
      newEmail = this.$newEmailInput.value,
      newPassword = this.$newPasswordInput.value,
      confirmNewPassword = this.$confirmNewPasswordInput.value,
      currentPassword = this.$currentPasswordInput.value;

    try {
      if (newUsername !== this.accountData.username) {
        await DataManager.updateUsername(newUsername);
        this.userSettingsModelState.value.username = newUsername;
        this.accountData.username = newUsername;
      }
      if (newEmail !== this.accountData.email) {
        await DataManager.updateEmail(newEmail, currentPassword);
        this.accountData.email = newEmail;
      }
      if (newPassword !== "") {
        if (newPassword === confirmNewPassword) {
          await DataManager.updatePassword(newPassword, currentPassword);
          await DataManager.signOut();
          window.location.reload();
        } else {
          this.showErrorToast("passwords not matching");
          return;
        }
      }
      this.close(true);
      this.$setUserSettingsFormula();
    } catch (error) {
      if (error instanceof Error) {
        this.showErrorToast(error.message);
      }
      return;
    }
  };

  private close = (didSave: boolean) => {
    this.didSave = didSave;
    this.notifyAll(Modal.DO_CLOSE_EVENT);
  };

  get htmlTagName(): string {
    return "user-settings";
  }

  onModalClose = () => {
    this.$setUserSettingsFormula();
    if (this.didSave) {
      this.onSavedUserSettings();
    } else {
      this.onCanceledUserSettings();
    }
    this.didSave = false;
  };

  private onSavedUserSettings = () => {
    new ToastFactory()
      .setType(ToastType.Success)
      .setMessage("💾 Your account settings have been updated")
      .show();
  };

  private onCanceledUserSettings = () => {
    new ToastFactory()
      .setType(ToastType.Warning)
      .setMessage("🗑️ Your changes have been discarded")
      .show();
  };

  private showErrorToast(message: string): void {
    new ToastFactory()
      .setMessage(message)
      .setType(ToastType.Error)
      .setDuration(ToastDuration.Short)
      .show();
  }
}
