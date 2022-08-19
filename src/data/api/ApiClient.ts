import { Server } from "./config";
import { Client } from "appwrite";
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

  static async logInUser() {
    await this.accountManager
      .createNewAccountSession(
        Server.TEST_USER_EMAIL,
        Server.TEST_USER_PASSWORD
      )
      .then((response) => {
        // returns session Object : https://appwrite.io/docs/models/session
        this.accountManager.sessionId = response.$id;
        this.accountManager.userId = response.userId;
      })
      .then(async () => {
        await this.accountManager.getAccountData().then(async (response) => {
          this.accountManager.userName = response.name;
        });
      });
  }

  static async logOutUser(): Promise<any> {
    return this.accountManager.deleteAccountSession();
  }
  static getUsername(): string {
    return this.accountManager.userName;
  }
}
