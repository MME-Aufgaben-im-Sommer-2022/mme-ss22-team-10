import { Account, Client, Models } from "appwrite";
import { TemplateItem } from "../models/UserSettingsModel";

export default class AccountManager {
  account: Account;
  sessionId: string;
  userName: string;
  userId: string;
  template: Array<TemplateItem>;

  constructor(client: Client) {
    this.account = new Account(client);
    this.sessionId = "";
    this.userId = "";
    this.userName = "";
    this.template = [];
  }

  async createNewAccount(
    email: string,
    password: string,
    name: string
  ): Promise<Models.User<Models.Preferences>> {
    return this.account.create("unique()", email, password, name);
  }

  // login User
  async createNewAccountSession(
    email: string,
    password: string
  ): Promise<Models.Session> {
    return this.account.createEmailSession(email, password);
  }

  // get currently logged in user data
  async getAccountData(): Promise<Models.User<Models.Preferences>> {
    return this.account.get();
  }

  // logs out user
  async deleteAccountSession(): Promise<any> {
    return this.account.deleteSession(this.sessionId);
  }
}
