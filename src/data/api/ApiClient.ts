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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  static async logInUser(email: string, password: string) {
    const accountSession = await this.accountManager.createNewAccountSession(
        Server.TEST_USER_EMAIL, // email
        Server.TEST_USER_PASSWORD // password
      ),
      accountData = await this.accountManager.getAccountData();
    this.accountManager.sessionId = accountSession.$id;
    this.accountManager.userId = accountSession.userId;
    this.accountManager.userName = accountData.name;
    await this.setUserTemplate();
  }

  static async logOutUser(): Promise<any> {
    return this.accountManager.deleteAccountSession();
  }

  static getUsername(): string {
    return this.accountManager.userName;
  }

  static getUserTemplate(): Array<TemplateItem> {
    return this.accountManager.template;
  }

  private static async getUserSettingsDocument(): Promise<Models.Document> {
    const userSettings = await this.databaseManager.listDocuments(
      Server.COLLECTION_SETTINGS,
      [Query.equal("userID", this.accountManager.userId)]
    );
    return userSettings.documents[0];
  }

  private static async setUserTemplate() {
    const userSettings = await this.getUserSettingsDocument();
    this.accountManager.template = this.jsonParseArray(userSettings.template);
  }

  static async createUserTemplate(
    template: Array<TemplateItem>
  ): Promise<Models.Document> {
    return await this.databaseManager.createNewDocument(
      Server.COLLECTION_SETTINGS,
      { userID: this.accountManager.userId, template: template }
    );
  }

  static async updateUserTemplate(template: Array<TemplateItem>) {
    const userSettings = await this.getUserSettingsDocument();
    this.databaseManager.updateDocument(
      Server.COLLECTION_SETTINGS,
      userSettings.$id,
      { template: this.stringifyArray(template) }
    );
    this.accountManager.template = template;
  }
      this.databaseManager.updateDocument(
        Server.COLLECTION_BLOCK_CONTENTS,
        blockContentDocument.$id,
        blockContent
      );
    });
  }

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
