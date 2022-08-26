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

// `DataManager` is a singleton, in which you define functions to fetch/save Models.

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/DataManager.md

export default class DataManager {
  static async init() {
    await ApiClient.init();
    await ApiClient.logInUser("email", "password");
  }

  // Write methods to fetch or save data to Database etc. here

  // Returns the example model
  static async getExampleModel(): Promise<ExampleModel> {
    // would query database here or other networking stuff
    return new ExampleModel("John", 0);
  }

  // Calendar Model

  static async getCalendarModel(): Promise<CalendarModel> {
    return this.generateMockCalendarModel();
  }

  static async saveCalendarModel(calendarModel: CalendarModel): Promise<void> {
    info("Saving calendar model:", calendarModel);
    return Promise.resolve();
  }

  // Editor Model

  static async getEditorModel(date: Date): Promise<EditorModel> {
    const editorNotes = await ApiClient.getEditorNotes(date);
    return new EditorModel(editorNotes.day, editorNotes.blockContents);
  }

  static async saveEditorModel(editorModel: EditorModel): Promise<void> {
    return await ApiClient.updateEditorNotes(editorModel);
  }

  static async createEditorModel(editorModel: EditorModel): Promise<void> {
    return await ApiClient.createEditorNotes(editorModel);
  }

  // User Settings Model
  static async getUserSettingsModel(): Promise<UserSettingsModel> {
    const username = await ApiClient.getUsername(),
      template = await ApiClient.getUserTemplate();
    return new UserSettingsModel(username, "token-xyz", { template });
  }

  static async saveUserSettingsModel(
    userSettingsModel: UserSettingsModel
  ): Promise<void> {
    return await ApiClient.updateUserTemplate(
      userSettingsModel.settings.template
    );
  }

  static async createUserSettingsModel(userSettingsModel: UserSettingsModel) {
    return await ApiClient.createUserTemplate(
      userSettingsModel.settings.template
    );
  }

  // MOCK DATA

  // Calendar Model
  private static generateMockCalendarModel(): CalendarModel {
    const noteDays: Years = {
      "2022": {},
    };

    generateRandomAscendingArray(11, 1).forEach((month) => {
      noteDays["2022"][month] = generateRandomAscendingArray(30, 1);
      if (noteDays["2022"][month].length === 0) {
        delete noteDays["2022"][month];
      }
    });

    return new CalendarModel(new Date(), noteDays);
  }

  // Editor Model

  private static generateMockEditorModel(): EditorModel {
    const NUM_BLOCKS = 3,
      day = new Date(),
      blockContents: Array<BlockContent> = [];

    blockContents.push({
      title: `Title 1`,
      inputType: BlockContentInputType.Checkbox,
      inputValue: `0___unchecked
        1___checked`,
    });
    blockContents.push({
      title: `Title 2`,
      inputType: BlockContentInputType.FreeText,
      inputValue: generateRandomLoremIpsum(100),
    });
    blockContents.push({
      title: `Title 3`,
      inputType: BlockContentInputType.BulletPoint,
      inputValue: `first point
      second point`,
    });

    return new EditorModel(day, blockContents);
  }

  // User Settings Model

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
