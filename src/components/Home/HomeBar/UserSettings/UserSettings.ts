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
import InputValidationResult, {
  validateEmail,
  validateNewPasswords,
  validateUsername,
} from "../../../../lib/utils/InputValidation";

interface ValidatedUserSettingsInput {
  username: string;
  email: string;
  newPassword: string;
}

export default class UserSettings extends WebComponent implements ModalContent {
  private userSettingsModelState: State<UserSettingsModel>;

  private $newUsernameInput!: HTMLInputElement;
  private $newEmailInput!: HTMLInputElement;
  private $newPasswordInput!: HTMLInputElement;
  private $confirmNewPasswordInput!: HTMLInputElement;
  private $cancelButton!: HTMLButtonElement;
  private $saveButton!: HTMLButtonElement;

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
    this.$newUsernameInput.value = this.userSettingsModelState.value.username;
    this.$newEmailInput = this.select("#new-email-input")!;
    // TODO; SET EMAIL HERE
    this.$newPasswordInput = this.select("#new-password-input")!;
    this.$newPasswordInput.value = "";
    this.$confirmNewPasswordInput = this.select("#confirm-new-password-input")!;
    this.$confirmNewPasswordInput.value = "";

    this.$cancelButton = this.select("#cancel-button")!;
    this.$saveButton = this.select("#save-button")!;
  }

  private initListener(): void {
    this.$cancelButton.addEventListener("click", this.$onCancelClicked);
    this.$saveButton.addEventListener("click", this.$onSaveClicked);
  }

  private $onCancelClicked = (): void => {
    this.close();
  };

  private $onSaveClicked = (): void => {
    this.validateInput()
      .then(this.saveSettings)
      .then(this.close)
      .catch((error) => {
        log(error);
        this.showErrorToast(error);
      });
  };

  private async saveSettings(
    settings: ValidatedUserSettingsInput
  ): Promise<void> {
    log("saving settings:", settings);

    // TODO: save input to server
    return Promise.resolve();
  }

  private async validateInput(): Promise<ValidatedUserSettingsInput> {
    const newUsername = this.$newUsernameInput.value,
      newEmail = this.$newEmailInput.value,
      newPassword = this.$newPasswordInput.value,
      confirmNewPassword = this.$confirmNewPasswordInput.value,
      inputValidationResults: Array<InputValidationResult> = [
        validateUsername(newUsername),
        validateEmail(newEmail),
        validateNewPasswords(newPassword, confirmNewPassword),
      ];

    if (inputValidationResults.some((r) => !r.isValid)) {
      const firstInvalidResult = inputValidationResults.find(
        (r) => !r.isValid
      )!;
      return Promise.reject(firstInvalidResult.message);
    }
    return {
      username: newUsername,
      email: newEmail,
      newPassword: newPassword,
    };
  }

  private close = () => {
    this.didSave = true;
    this.notifyAll(Modal.DO_CLOSE_EVENT);
  };

  get htmlTagName(): string {
    return "user-settings";
  }

  onModalClose = () => {
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
