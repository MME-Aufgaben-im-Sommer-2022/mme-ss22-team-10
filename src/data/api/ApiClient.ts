import { Server } from "./config";
import { Client, Query } from "appwrite";
import AccountManager from "./AccountManager";
import DatabaseManager from "./DatabaseManager";
import { TemplateItem } from "../models/UserSettingsModel";

export default class ApiClient {
  private static client: Client;
  private static accountManager: AccountManager;
  private static databaseManager: DatabaseManager;

  static async init() {
    this.client = new Client();
    this.client.setEndpoint(Server.ENDPOINT);
    this.client.setProject(Server.PROJECT_ID);
    this.accountManager = new AccountManager(this.client);
    this.databaseManager = new DatabaseManager(this.client, Server.DATABASE_ID);
  }

  static async logInUser(email: string, password: string) {
    await this.accountManager
      .createNewAccountSession(
        Server.TEST_USER_EMAIL, // email
        Server.TEST_USER_PASSWORD // password
      )
      .then((response) => {
        this.accountManager.sessionId = response.$id;
        this.accountManager.userId = response.userId;
      })
      .then(async () => {
        await this.accountManager.getAccountData().then(async (response) => {
          this.accountManager.userName = response.name;
          await this.setUserTemplate();
        });
      });
  }

  static async logOutUser(): Promise<any> {
    return this.accountManager.deleteAccountSession();
  }

  private static getUserTemplateDocument() {
    return this.databaseManager.listDocuments(Server.COLLECTION_SETTINGS, [
      Query.equal("userID", this.accountManager.userId),
    ]);
  }

  private static async setUserTemplate() {
    await this.getUserTemplateDocument().then((response) => {
      const template = response.documents[0].template;
      this.accountManager.template = this.jsonParseArray(template);
    });
  }

  static getUserTemplate(): Array<TemplateItem> {
    return this.accountManager.template;
  }

  static async updateUserTemplate(template: Array<TemplateItem>) {
    await this.getUserTemplateDocument().then((response) => {
      this.databaseManager.updateDocument(
        Server.COLLECTION_SETTINGS,
        response.documents[0].$id,
        { template: this.stringifyArray(template) }
      );
    });
    this.accountManager.template = template;
  }

  static getUsername(): string {
    return this.accountManager.userName;
  }

  private static stringifyArray(array: Array<any>): Array<string> {
    const stringArray: Array<string> = [];
    array.forEach((entry) => stringArray.push(JSON.stringify(entry)));
    return stringArray;
  }

  private static jsonParseArray(array: Array<string>): Array<any> {
    const objArray: Array<any> = [];
    array.forEach((entry) => objArray.push(JSON.parse(entry)));
    return objArray;
  }
}
