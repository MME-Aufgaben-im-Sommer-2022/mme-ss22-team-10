import { Account, Client, Models } from "appwrite";

/**
 * class that contains basic function from the Account API
 * @see {@link https://appwrite.io/docs/client/account?sdk=web-default Account API}
 */
export default class AccountManager {
  account: Account;

  /**
   * initialize a new instance of the AccountManager class
   * @param client
   */
  constructor(client: Client) {
    this.account = new Account(client);
  }

  /**
   * create a new user
   * @remarks Only accepts 10 requests every 60 minutes per IP address
   * @param email
   * @param password
   * @param username
   * @returns {@link https://appwrite.io/docs/models/user User Object}
   */
  async createNewAccount(
    email: string,
    password: string,
    username: string
  ): Promise<Models.User<Models.Preferences>> {
    return this.account.create("unique()", email, password, username);
  }

  /**
   * create new account session via email
   * @param email
   * @param password
   * @returns {@link https://appwrite.io/docs/models/session Session Object}
   */
  async createNewAccountSession(
    email: string,
    password: string
  ): Promise<Models.Session> {
    return this.account.createEmailSession(email, password);
  }

  /**
   * get a session via id
   * @param sessionId
   * @returns {@link https://appwrite.io/docs/models/session Session Object}
   */
  async getAccountSession(sessionId: string) {
    return this.account.getSession(sessionId);
  }

  /**
   * get currently logged in user data
   * @returns {@link https://appwrite.io/docs/models/user User Object}
   */
  async getAccountData(): Promise<Models.User<Models.Preferences>> {
    return this.account.get();
  }

  /**
   * remove session from api
   * @param sessionId
   */
  async deleteAccountSession(sessionId: string): Promise<any> {
    return this.account.deleteSession(sessionId);
  }
}
