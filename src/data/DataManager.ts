import ExampleModel from "./models/ExampleModel";
import CalendarModel, { Years } from "./models/CalendarModel";
import { info } from "../lib/utils/Logger";
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

// `DataManager` is a singleton, in which you define functions to fetch/save/delete Models.

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/DataManager.md
export default class DataManager {
  static async init() {
    await ApiClient.init();
    await this.logInUser("email", "password");
  }

  // Write methods to fetch or save data to Database etc. here

  // Returns the example model
  static async getExampleModel(): Promise<ExampleModel> {
    // would query database here or other networking stuff
    return new ExampleModel("John", 0);
  }

  static async logInUser(email: string, password: string) {
    const localSessionId = localStorage.getItem("sessionId");
    if (localSessionId) {
      const session = await ApiClient.getSession(localSessionId);
      if (this.convertNumberToDate(session.expire) > new Date()) {
        return await ApiClient.connectSession(session);
      }
    }
    return await ApiClient.createNewSession(email, password).then((session) => {
      ApiClient.connectSession(session);
    });
  }

  // Calendar Model
  static async getCalendarModel(): Promise<CalendarModel> {
    const noteDays: Years = {},
      noteDaysArray = await ApiClient.getNoteDays();
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

  static async saveCalendarModel(calendarModel: CalendarModel): Promise<void> {
    info("Saving calendar model:", calendarModel);
    return Promise.resolve();
  }

  // Editor Model
  static async getEditorModel(date: Date): Promise<EditorModel> {
    let editorNotes;
    try {
      editorNotes = await ApiClient.getEditorNotes(date);
    } catch (e) {
      const editorModel = await this.createEditorModelFromTemplate();
      await ApiClient.createEditorNotes(editorModel);
      return editorModel;
    }
    return new EditorModel(editorNotes.day, editorNotes.blockContents);
  }

  static async saveEditorModel(editorModel: EditorModel): Promise<void> {
    return await ApiClient.updateEditorNotes(editorModel);
  }

  private static async createEditorModelFromTemplate(): Promise<EditorModel> {
    const blockContents: Array<BlockContent> = [],
      promise = await DataManager.getUserSettingsModel();
    promise.settings.template.forEach((entry) => {
      blockContents.push(<BlockContent>{
        title: entry.title,
        inputType: entry.inputType,
        inputValue: "",
      });
    });
    return new EditorModel(new Date(), blockContents);
  }

  // User Settings Model
  static async getUserSettingsModel(): Promise<UserSettingsModel> {
    const account = await ApiClient.getAccountData(),
      templateData = await ApiClient.getUserTemplate(),
      template = this.jsonParseArray(templateData);

    return new UserSettingsModel(account.name, "token-xyz", { template });
  }

  static async saveUserSettingsModel(
    userSettingsModel: UserSettingsModel
  ): Promise<void> {
    return await ApiClient.updateUserTemplate(
      this.stringifyArray(userSettingsModel.settings.template)
    );
  }

  static async createUserSettingsModel(userSettingsModel: UserSettingsModel) {
    return await ApiClient.createUserTemplate(
      userSettingsModel.settings.template
    );
  }

  // HELPER FUNCTIONS
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

  // MOCK DATA
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private static async deleteUserNotes() {
    const userNotes: Array<any> = await ApiClient.getNoteDays();
    userNotes.forEach(async (note) => {
      await ApiClient.deleteEditorNotes(note.$id);
    });
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
        const editorModel = this.generateMockEditorModel(date);
        try {
          await ApiClient.createEditorNotes(editorModel);
        } catch (e) {
          ApiClient.updateEditorNotes(editorModel);
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
  private static generateMockEditorModel(date: Date): EditorModel {
    const NUM_BLOCKS = 3,
      day = date,
      blockContents: Array<BlockContent> = [];

    for (let i = 0; i < NUM_BLOCKS; i++) {
      blockContents.push({
        title: `Title ${i}`,
        inputType: BlockContentInputType.FreeText,
        // eslint-disable-next-line no-magic-numbers
        inputValue: generateRandomLoremIpsum(50),
      });
    }
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

    return new UserSettingsModel("user1", "token-xyz", { template });
  }
}
