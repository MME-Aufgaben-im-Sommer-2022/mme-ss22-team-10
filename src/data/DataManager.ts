import ExampleModel from "./models/ExampleModel";
import CalendarModel, { Years } from "./models/CalendarModel";
import {
  generateRandomAscendingArray,
  generateRandomLoremIpsum,
} from "../lib/utils";
import { info } from "../lib/utils/Logger";
import EditorModel, {
  BlockContent,
  BlockContentInputType,
} from "./models/EditorModel";

// `DataManager` is a singleton, in which you define functions to fetch/save Models.

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/DataManager.md

export default class DataManager {
  static async init() {
    // Do init stuff here, e.g. db connection
  }

  // Write methods to fetch or save data to Database etc here

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

  static async getEditorModel(): Promise<EditorModel> {
    return this.generateMockEditorModel();
  }

  static async saveEditorModel(editorModel: EditorModel): Promise<void> {
    info("Saving editor model:", editorModel);
    return Promise.resolve();
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

    for (let i = 0; i < NUM_BLOCKS; i++) {
      blockContents.push({
        title: `Title ${i}`,
        inputType: BlockContentInputType.FreeText,
        inputValue: generateRandomLoremIpsum(50),
      });
    }
    return new EditorModel(day, blockContents);
  }
}
