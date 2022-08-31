import { Account, Client, Models } from "appwrite";

export default class AccountManager {
  account: Account;

  constructor(client: Client) {
    this.account = new Account(client);
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

  async getAccountSession(sessionId: string) {
    return this.account.getSession(sessionId);
  }

  // get currently logged in user data
  async getAccountData(): Promise<Models.User<Models.Preferences>> {
    return this.account.get();
  }

  // logs out user
  async deleteAccountSession(sessionId: string): Promise<any> {
    return this.account.deleteSession(sessionId);
  }
}
