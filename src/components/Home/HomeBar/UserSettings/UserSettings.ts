import WebComponent from "../../../../lib/components/WebComponent";
import html from "./UserSettings.html";
import css from "./UserSettings.css";
import { ToastFactory } from "../../../atomics/Toast/ToastFactory";
import { ToastDuration, ToastType } from "../../../atomics/Toast/Toast";
import { log } from "../../../../lib/utils/Logger";
import UserSettingsModel from "../../../../data/models/UserSettingsModel";
import GlobalState from "../../../../lib/state/GlobalState";
import { GlobalStates } from "../../../../state/GlobalStates";
import State from "../../../../lib/state/State";
import Modal, { ModalContent } from "../../../atomics/Modal/Modal";

export default class UserSettings extends WebComponent implements ModalContent {
  private userSettingsModelState: State<UserSettingsModel>;

  private $newUsernameInput!: HTMLInputElement;
  private $newEmailInput!: HTMLInputElement;
  private $newPasswordInput!: HTMLInputElement;
  private $confirmNewPasswordInput!: HTMLInputElement;
  private $currentPasswordInput!: HTMLInputElement;
  private $cancelButton!: HTMLButtonElement;
  private $saveButton!: HTMLButtonElement;

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

  onModalClose = (data: any) => {
    log("onModalClose");
  };

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
  }

  private initListener(): void {
    this.$cancelButton.addEventListener("click", this.$onCancelClicked);
    this.$saveButton.addEventListener("click", this.$onSaveClicked);
  }

  private $onCancelClicked = (): void => {
    this.showCancelToast();
    this.close();
  };

  private $onSaveClicked = (): void => {
    this.saveSettings()
      .then(() => {
        this.showSaveSuccessToast();
        this.close();
      })
      .catch((error) => {
        log(error);
        this.showErrorToast(error);
      });
  };

  private async saveSettings(): Promise<void> {
    const newUsername = this.$newUsernameInput.value,
      newEmail = this.$newEmailInput.value,
      newPassword = this.$newPasswordInput.value,
      confirmNewPassword = this.$confirmNewPasswordInput.value,
      currentPassword = this.$currentPasswordInput.value;
    // TODO: validate input
    log(
      "newUsername",
      newUsername,
      "newEmail",
      newEmail,
      "newPassword",
      newPassword,
      "confirmNewPassword",
      confirmNewPassword,
      "currentPassword",
      currentPassword
    );
    const isValidInput = true;
    if (isValidInput) {
      // TODO: Update DB
      return Promise.resolve();
    }

    return Promise.reject("Invalid input");
  }

  private close(): void {
    this.notifyAll(Modal.DO_CLOSE_EVENT);
  }

  get htmlTagName(): string {
    return "user-settings";
  }

  // Toasts
  private showCancelToast(): void {
    new ToastFactory()
      .setMessage("Your settings have not been saved")
      .setType(ToastType.Warning)
      .setDuration(ToastDuration.Short)
      .show();
  }

  private showSaveSuccessToast(): void {
    new ToastFactory()
      .setMessage("Your settings have been saved")
      .setType(ToastType.Success)
      .setDuration(ToastDuration.Short)
      .show();
  }

  private showErrorToast(message: string): void {
    new ToastFactory()
      .setMessage(message)
      .setType(ToastType.Error)
      .setDuration(ToastDuration.Short)
      .show();
  }
}
