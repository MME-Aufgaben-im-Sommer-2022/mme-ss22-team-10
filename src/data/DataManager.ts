import ExampleModel from "./models/ExampleModel";
import CalendarModel, { Years } from "./models/CalendarModel";
import EditorModel, {
  BlockContent,
  BlockContentInputType,
} from "./models/EditorModel";
import UserSettingsModel, { Template } from "./models/UserSettingsModel";
import {
  generateRandomAscendingArray,
  generateRandomLoremIpsum,
} from "../lib/utils";
import ApiClient from "./api/ApiClient";
import TemplateConfigurationModel, {
  Topic,
} from "./models/TemplateConfigurationModel";
import templateConfigurationModel from "./models/templateConfigurationModel.json";
import { log } from "../lib/utils/Logger";

// `DataManager` is a singleton, in which you define functions to fetch/save/delete Models.

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/DataManager.md
export default class DataManager {
  static async init() {
    await ApiClient.init();
  }

  // Write methods to fetch or save data to Database etc. here

  // Returns the example model
  static async getExampleModel(): Promise<ExampleModel> {
    // would query database here or other networking stuff
    return new ExampleModel("John", 0);
  }

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

  static async signUp(email: string, password: string, name: string) {
    await ApiClient.createAccount(email, password, name);
    const connected = await this.signInViaMail(email, password);
    if (connected) {
      await ApiClient.createNewSettingsDocument([]);
    }
  }

  private static async connectToSession(sessionId: string): Promise<boolean> {
    const session = await ApiClient.getSession(sessionId);
    if (this.convertNumberToDate(session.expire) > new Date()) {
      await ApiClient.connectSession(session);
      return true;
    }
    return false;
  }

  static async checkIfUserLoggedIn(): Promise<boolean> {
    const localSessionId = localStorage.getItem("sessionId");
    let connected = false;
    if (localSessionId) {
      connected = await this.connectToSession(localSessionId);
    }
    return connected;
  }

  static async signOut() {
    await ApiClient.disconnectCurrentSession();
  }

  // Calendar Model
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
      return new EditorModel(day, blockContents);
    } catch (e) {
      const editorModel = await this.createEditorModelFromTemplate();
      await this.createEditorModel(editorModel);
      return editorModel;
    }
  }

  static async createEditorModel(editorModel: EditorModel) {
    const noteDocument = await ApiClient.createNewNoteDocument(
      this.convertDateToString(editorModel.day)
    );
    editorModel.blockContents.forEach(async (blockContent) => {
      ApiClient.createNewBlockContentDocument(noteDocument.$id, blockContent);
    });
  }

  static async updateEditorModel(editorModel: EditorModel): Promise<void> {
    log(this.convertDateToString(editorModel.day));
    editorModel.blockContents.forEach((blockContent) => {
      ApiClient.updateBlockContentDocument(blockContent.documentId, {
        title: blockContent.title,
        inputType: blockContent.inputType,
        inputValue: blockContent.inputValue,
      });
    });
  }

  private static async createEditorModelFromTemplate(): Promise<EditorModel> {
    const promise = await DataManager.getUserSettingsModel(),
      blockContents = this.convertArrayToBlockContent(
        promise.settings.template
      );
    return new EditorModel(new Date(), blockContents);
  }

  static async deleteEditorModel(editorModel: EditorModel): Promise<void> {
    const noteDocument = await ApiClient.getNoteDocument(
      this.convertDateToString(editorModel.day)
    );
    await ApiClient.deleteNoteDocument(noteDocument.$id);
    return await ApiClient.deleteBlockContents(noteDocument.$id);
  }


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
  private static async getLastNotes(): Promise<Array<Models.Document>> {
    const notes = await ApiClient.getNoteDocumentList(),
      noteWithoutToday = notes.filter((note) => {
        return note.day !== this.convertDateToString(new Date());
      }),
      sortedNotes = noteWithoutToday
        .sort((note1, note2) =>
          new Date(note1.day) < new Date(note2.day) ? 1 : -1
        )
        .slice(0, NUMBER_OF_BLOCK_CONTENTS_WITHOUT_GPT3);
    return sortedNotes;
  }

  // User Settings Model
  static async getUserSettingsModel(): Promise<UserSettingsModel> {
    const account = await ApiClient.getAccountData(),
      userSettings = await ApiClient.getUserSettingsDocument(),
      templateData = userSettings.template,
      template = this.jsonParseArray(templateData);
    return new UserSettingsModel(account.name, { template });
  }

  static async updateUserSettingsModel(
    userSettingsModel: UserSettingsModel
  ): Promise<void> {
    await ApiClient.updateAccountName(userSettingsModel.username);
    return await ApiClient.updateUserSettingsDocument(
      this.stringifyArray(userSettingsModel.settings.template)
    );
  }

  static async createUserSettingsModel(userSettingsModel: UserSettingsModel) {
    return await ApiClient.createNewSettingsDocument(
      userSettingsModel.settings.template
    );
  }

  // Template config screen
  static async getTemplateConfigurationModel(): Promise<TemplateConfigurationModel> {
    const configModel = new TemplateConfigurationModel(
      templateConfigurationModel.map((topic: Topic) => topic)
    );
    return configModel;
  }

  // HELPER FUNCTIONS
  private static dayIsToday(day: Date) {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  }

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

  private static convertNumberToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }

  private static jsonParseArray(array: Array<string>): Array<any> {
    const objArray: Array<any> = [];
    array.forEach((entry) => objArray.push(JSON.parse(entry)));
    return objArray;
  }

  private static stringifyArray(array: Array<any>): Array<string> {
    const stringArray: Array<string> = [];
    array.forEach((entry) => stringArray.push(JSON.stringify(entry)));
    return stringArray;
  }

  private static convertDateToString(date: Date): string {
    return [
      date.getFullYear(),
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1,
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
    ].join("-");
  }

  // MOCK DATA
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private static async generateMockDatabaseData() {
    // eslint-disable-next-line no-magic-numbers
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach((month) => {
      // eslint-disable-next-line no-magic-numbers
      generateRandomAscendingArray(16, 1).forEach(async (day) => {
        const date = new Date();
        // eslint-disable-next-line no-unused-expressions
        month < date.getMonth()
          ? // eslint-disable-next-line no-magic-numbers
            date.setFullYear(2022)
          : // eslint-disable-next-line no-magic-numbers
            date.setFullYear(2021);
        date.setDate(Number(day));
        date.setMonth(month);
        // eslint-disable-next-line one-var
        const editorModel = await this.generateMockEditorModel(date);
        try {
          await this.createEditorModel(editorModel);
        } catch (e) {
          this.updateEditorModel(editorModel);
        }
      });
    });
  }

  // Calendar Model
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private static generateMockCalendarModel(): CalendarModel {
    const noteDays: Years = {
      "2022": {},
    };

    // eslint-disable-next-line no-magic-numbers
    generateRandomAscendingArray(11, 1).forEach((month) => {
      // eslint-disable-next-line no-magic-numbers
      noteDays["2022"][month] = generateRandomAscendingArray(30, 1);
      if (noteDays["2022"][month].length === 0) {
        delete noteDays["2022"][month];
      }
    });

    return new CalendarModel(new Date(), noteDays);
  }

  // Editor Model
  private static async generateMockEditorModel(
    date: Date
  ): Promise<EditorModel> {
    const day = date,
      blockContents: Array<BlockContent> = [],
      userSettings = await this.getUserSettingsModel();

    userSettings.settings.template.forEach((block) => {
      blockContents.push(<BlockContent>{
        title: block.title,
        inputType: block.inputType,
        inputValue: "",
        documentId: "",
      });
    });
    return new EditorModel(day, blockContents);
  }

  // User Settings Model
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private static generateMockUserSettingsModel(): UserSettingsModel {
    const template: Template = [
      {
        title: "Title 1",
        inputType: BlockContentInputType.FreeText,
      },
      {
        title: "Title 2",
        inputType: BlockContentInputType.FreeText,
      },
      {
        title: "Title 3",
        inputType: BlockContentInputType.FreeText,
      },
    ];

    return new UserSettingsModel("user1", { template });
  }
}
