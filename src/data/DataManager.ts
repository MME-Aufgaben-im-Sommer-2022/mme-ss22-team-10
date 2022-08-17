import ExampleModel from "./models/ExampleModel";

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
}
