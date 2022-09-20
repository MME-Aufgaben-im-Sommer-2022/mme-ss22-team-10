import CalendarModel, { Years } from "./models/CalendarModel";
import EditorModel, {
  BlockContent,
  BlockContentInputType,
} from "./models/EditorModel";
import UserSettingsModel from "./models/UserSettingsModel";
import ApiClient from "./api/ApiClient";
import TemplateConfigurationModel, {
  Topic,
} from "./models/TemplateConfigurationModel";
import templateConfigurationModel from "./models/templateConfigurationModel.json";
import { Models } from "appwrite";

const NUM_OF_DEFAULT_BLOCK_CONTENTS = 3;

/**
 * Class that contains functions to fetch/save/delete Models.
 * @see {@link https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/DataManager.md DataManager}
 */
export default class DataManager {
  static async init() {
    await ApiClient.init();
  }

  /**
   * sign in by creating a new session
   * @param email
   * @param password
   * @returns true if the session was created successfully
   */
  static async signInViaMail(
    email: string,
    password: string
  ): Promise<boolean> {
    await ApiClient.createNewSession(email, password)
      .then((session) => {
        ApiClient.connectSession(session);
      })
      .catch()
      .then(() => {
        return false;
      });
    return true;
  }

  /**
   * creates a new account and empty document for the user settings
   * signs user in automatically
   * @param email
   * @param password
   * @param username
   */
  static async signUp(email: string, password: string, username: string) {
    await ApiClient.createAccount(email, password, username);
    const connected = await this.signInViaMail(email, password);
    if (connected) {
      await ApiClient.createNewSettingsDocument([]);
    }
  }

  /**
   * check if the session is still valid and connect to it
   * @param sessionId
   * @private
   * @returns true if connected successfully
   */
  private static async connectToSession(sessionId: string): Promise<boolean> {
    const session = await ApiClient.getSession(sessionId);
    if (this.convertNumberToDate(session.expire) > new Date()) {
      await ApiClient.connectSession(session);
      return true;
    }
    return false;
  }

  /**
   * will check if there is a session in the local storage and will try to connect to it
   * @returns true if connected successfully
   */
  static async checkIfUserLoggedIn(): Promise<boolean> {
    const localSessionId = localStorage.getItem("sessionId");
    let connected = false;
    if (localSessionId) {
      connected = await this.connectToSession(localSessionId);
    }
    return connected;
  }

  /**
   * removes current sessions
   */
  static async signOut() {
    await ApiClient.disconnectCurrentSession();
  }

  /**
   * get data of logged in user
   */
  static async getAccountData() {
    const accountData = await ApiClient.getUserData();
    return {
      name: accountData.name,
      email: accountData.email,
      emailVerification: accountData.emailVerification,
      registrationDate: this.convertNumberToDate(accountData.registration),
      lastUpdate: this.convertNumberToDate(accountData.$updatedAt),
    };
  }

  /**
   * update name of currently logged-in user
   * @param username Max length: 128 chars
   * @returns {@link https://appwrite.io/docs/models/account Account Object}
   */
  static async updateUsername(username: string) {
    return ApiClient.updateUsername(username);
  }

  /**
   * update email currently logged-in user email address.
   * @param email
   * @param currentPassword Must be at least 8 chars.
   * @returns {@link https://appwrite.io/docs/models/account Account Object}
   */
  static async updateEmail(email: string, currentPassword: string) {
    return ApiClient.updateUserEmail(email, currentPassword);
  }

  /**
   * update currently logged-in user password. For validation,
   * user is required to pass in the new password, and the old password.
   * @param newPassword Must be at least 8 chars.
   * @param currentPassword Must be at least 8 chars.
   * @returns {@link https://appwrite.io/docs/models/account Account Object}
   */
  static async updatePassword(newPassword: string, currentPassword: string) {
    return ApiClient.updateUserPassword(newPassword, currentPassword);
  }

  /**
   * send an email with a password reset URL to currently logged-in user
   * @remarks limited to 10 requests in every 60 minutes per email address
   * @param email
   * @returns {@link https://appwrite.io/docs/models/token Token Object}
   */
  static async sendPasswordRecoveryLink(email: string) {
    return ApiClient.createPasswordRecovery(email);
  }

  /**
   * endpoint to complete the user account password reset
   * @remarks limited to 10 requests in every 60 minutes per email address
   * @param userId
   * @param secret Valid reset token.
   * @param password New user password. Must be at least 8 chars.
   */
  static async recoverPassword(
    userId: string,
    secret: string,
    password: string
  ) {
    return ApiClient.confirmPasswordRecovery(userId, secret, password);
  }

  /**
   * fetches all note documents from the user and prepares data for a CalendarModel object
   * @returns {@link CalendarModel} object
   */
  static async getCalendarModel(): Promise<CalendarModel> {
    const noteDays: Years = {},
      noteDaysArray = await ApiClient.getNoteDocumentList();
    noteDaysArray.forEach((note) => {
      const date = new Date(note.day),
        year = date.getFullYear() + "",
        month = date.getMonth() + 1 + "",
        day = date.getDate() + "";

      if (!(year in noteDays)) {
        noteDays[year] = {};
      }
      if (!(month in noteDays[year])) {
        noteDays[year][month] = [];
      }
      noteDays[year][month].push(day);
    });
    return new CalendarModel(new Date(), noteDays);
  }

  // Editor Model
  /**
   * fetch Note and BlockContent documents from user to create an EditorModel object
   * if there are no documents for given day, new ones will be created
   * @param day
   * @returns {@link EditorModel} object
   */
  static async getEditorModel(day: Date): Promise<EditorModel> {
    try {
      const noteDocument = await ApiClient.getNoteDocument(
          this.convertDateToString(day)
        ),
        blockContentsDocuments = await ApiClient.getBlockContentDocumentList(
          noteDocument.$id
        ),
        blockContents = this.convertArrayToBlockContent(
          blockContentsDocuments.documents
        );
      if (
        this.dayIsToday(day) &&
        blockContents.length === NUM_OF_DEFAULT_BLOCK_CONTENTS
      ) {
        const newBlockContent = await this.getGPT3BlockContentDocument(
          noteDocument.$id
        );
        if (newBlockContent !== null) {
          blockContents.push(newBlockContent);
        }
      }
      return new EditorModel(day, blockContents);
    } catch (e) {
      const editorModel = await this.createEditorModelFromTemplate();
      return await this.createEditorModel(editorModel);
    }
  }

  /**
   * create new Note and BlockContent documents by given object
   * @param editorModel
   */
  static async createEditorModel(editorModel: EditorModel) {
    const noteDocument = await ApiClient.createNewNoteDocument(
      this.convertDateToString(editorModel.day)
    );
    editorModel.blockContents.forEach(async (blockContent) => {
      const blockContentDocument =
        await ApiClient.createNewBlockContentDocument(
          noteDocument.$id,
          blockContent
        );
      blockContent.documentId = blockContentDocument.$id;
    });
    return editorModel;
  }

  /**
   * update Note and BlockContent documents
   * @param editorModel
   */
  static async updateEditorModel(editorModel: EditorModel): Promise<void> {
    editorModel.blockContents.forEach((blockContent) => {
      ApiClient.updateBlockContentDocument(blockContent.documentId, {
        title: blockContent.title,
        inputType: blockContent.inputType,
        inputValue: blockContent.inputValue,
      });
    });
  }

  /**
   * fetch user settings and get GPT3-BlockContent to create a new EditorModel
   * @private
   * @returns {@link EditorModel} object
   */
  private static async createEditorModelFromTemplate(): Promise<EditorModel> {
    const promise = await DataManager.getUserSettingsModel(),
      blockContent = await this.getGPT3BlockContent(),
      blockContents = this.convertArrayToBlockContent(
        promise.settings.template
      );
    if (blockContent !== undefined) {
      blockContents.push(<BlockContent>blockContent);
    }
    return new EditorModel(new Date(), blockContents);
  }

  /**
   * delete Note and BlockContent documents
   * @param editorModel
   */
  static async deleteEditorModel(editorModel: EditorModel): Promise<void> {
    const noteDocument = await ApiClient.getNoteDocument(
      this.convertDateToString(editorModel.day)
    );
    await ApiClient.deleteNoteDocument(noteDocument.$id);
    return await ApiClient.deleteBlockContents(noteDocument.$id);
  }

  /**
   * create a new GPT3BlockContent to an existing note
   * @param noteId
   * @private
   * @returns {@link BlockContent} object
   */
  private static async getGPT3BlockContentDocument(noteId: string) {
    const blockContent = await this.getGPT3BlockContent();
    if (blockContent !== null) {
      const blockContentDocument =
        await ApiClient.createNewBlockContentDocument(noteId, blockContent);
      blockContent.documentId = blockContentDocument.$id;
    }
    return blockContent;
  }

  /**
   * get a gpt3 generated title and create a new BlockContent
   * @private
   * @returns {@link BlockContent} object
   * @remarks no database document created, documentId is empty
   */
  private static async getGPT3BlockContent() {
    const blocks = await this.getGPT3BlockContentParameter();
    if (blocks.length >= 3) {
      const response = await ApiClient.getGeneratedTitle(blocks);
      return {
        title: response.gptTitle,
        inputType: BlockContentInputType.FreeText,
        inputValue: "",
        documentId: "",
      };
    }
    return null;
  }

  /**
   * put the BlockContents of the user's last notes into an array
   * @remarks currently fetches last 3 notes
   * @private
   * @returns array of {@link BlockContent} objects
   */
  private static async getGPT3BlockContentParameter(): Promise<
    Array<Models.Document>
  > {
    const notes = await this.getLastNotes(),
      blockContents: Models.Document[] = [];
    notes.forEach(async (note) => {
      const blockContentsList = await ApiClient.getBlockContentDocumentList(
        note.$id
      );
      blockContentsList.documents.forEach((blockContent) =>
        blockContents.push(blockContent)
      );
    });
    return blockContents;
  }

  /**
   * get the last 3 notes documents from user
   * @private
   * @returns array of {@link https://appwrite.io/docs/models/document Document Objects}
   */
  private static async getLastNotes(): Promise<Array<Models.Document>> {
    const notes = await ApiClient.getNoteDocumentList(),
      noteWithoutToday = notes.filter((note) => {
        return note.day !== this.convertDateToString(new Date());
      }),
      sortedNotes = noteWithoutToday
        .sort((note1, note2) =>
          new Date(note1.day) < new Date(note2.day) ? 1 : -1
        )
        .slice(0, NUM_OF_DEFAULT_BLOCK_CONTENTS);
    return sortedNotes;
  }

  /**
   * get current user settings
   * @returns {@link UserSettingsModel} object
   */
  static async getUserSettingsModel(): Promise<UserSettingsModel> {
    const account = await ApiClient.getUserData(),
      userSettings = await ApiClient.getUserSettingsDocument(),
      templateData = userSettings.template,
      template = this.jsonParseArray(templateData);
    return new UserSettingsModel(account.name, { template });
  }

  /**
   * update current user settings
   * @param userSettingsModel
   */
  static async updateUserSettingsModel(
    userSettingsModel: UserSettingsModel
  ): Promise<void> {
    await ApiClient.updateUsername(userSettingsModel.username);
    return await ApiClient.updateUserSettingsDocument(
      this.stringifyArray(userSettingsModel.settings.template)
    );
  }

  /**
   * create a new document for user settings
   * @param userSettingsModel
   */
  static async createUserSettingsModel(userSettingsModel: UserSettingsModel) {
    return await ApiClient.createNewSettingsDocument(
      userSettingsModel.settings.template
    );
  }

  /**
   * @returns {@link templateConfigurationModel}
   */
  static async getTemplateConfigurationModel(): Promise<TemplateConfigurationModel> {
    const configModel = new TemplateConfigurationModel(
      templateConfigurationModel.map((topic: Topic) => topic)
    );
    return configModel;
  }

  /**
   * get dark mode preferences and adjust the UI style
   */
  static getDarkMode(): boolean {
    const savedPreference = localStorage.getItem("darkMode");
    if (savedPreference === null) {
      // get from browser preference
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      localStorage.setItem("darkMode", isDarkMode.toString());
      return isDarkMode;
    }
    return savedPreference === "true";
  }

  /**
   * sets darkMode in localStorage
   * @param darkMode
   */
  static setDarkMode(darkMode: boolean): void {
    localStorage.setItem("darkMode", darkMode.toString());
  }

  /**
   * @param day
   * @private
   * @returns true if given day is today
   */
  private static dayIsToday(day: Date) {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  }

  /**
   * convert Array<any> to Array<BlockContent>
   * @remarks fetched BlockContent documents from the API don't fit the {@link BlockContent} Interface and have to be converted
   * @param array
   * @private
   * @returns array of {@link BlockContent}s
   */
  private static convertArrayToBlockContent(array: Array<any>) {
    const blockContents: Array<BlockContent> = [];
    array.forEach((entry) => {
      blockContents.push(<BlockContent>{
        title: entry.title,
        inputType: entry.inputType,
        inputValue: entry.inputValue,
        documentId: entry.$id,
      });
    });
    return blockContents;
  }

  /**
   * convert timestamp to Date
   * @param timestamp primitive value of a Date object.
   * @private
   * @returns {@link Date} object
   */
  private static convertNumberToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }

  /**
   * convert Array<string> to Array<any>
   * @remarks user setting documents are saved as Array<string> and need to be converted to create an {@link UserSettingsModel} object
   * @param array
   * @private
   * @returns array of {@link any objects}
   */
  private static jsonParseArray(array: Array<string>): Array<any> {
    const objArray: Array<any> = [];
    array.forEach((entry) => objArray.push(JSON.parse(entry)));
    return objArray;
  }

  /**
   * convert Array<any> to Array<string>
   * @remarks user setting documents are saved as Array<string> so {@link BlockContent} arrays have to be converted
   * @param array
   * @private
   * @returns array of Strings
   */
  private static stringifyArray(array: Array<any>): Array<string> {
    const stringArray: Array<string> = [];
    array.forEach((entry) => stringArray.push(JSON.stringify(entry)));
    return stringArray;
  }

  /**
   * convert {@link Date} object to String object
   * @param date
   * @private
   * @returns date as String (format 'yyyy-mm-dd')
   */
  private static convertDateToString(date: Date): string {
    return [
      date.getFullYear(),
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1,
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
    ].join("-");
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private static async deleteUserNotes() {
    const userNotes: Array<any> = await ApiClient.getNoteDocumentList();
    userNotes.forEach(async (note) => {
      await ApiClient.deleteBlockContents(note.$id);
      await ApiClient.deleteNoteDocument(note.$id);
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private static async deleteUserSettings() {
    return await ApiClient.updateUserSettingsDocument(this.stringifyArray([]));
  }
}
