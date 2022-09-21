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
   * update name of user
   * @param username Max length: 128 chars
   * @returns {@link https://appwrite.io/docs/models/account Account Object}
   */
  async updateAccountName(username: string) {
    return this.account.updateName(username);
  }

  /**
   * update currently logged-in user password. For validation,
   * user is required to pass in the new password, and the old password.
   * @param newPassword Must be at least 8 chars.
   * @param currentPassword Must be at least 8 chars.
   * @returns {@link https://appwrite.io/docs/models/account Account Object}
   */
  async updateAccountPassword(newPassword: string, currentPassword: string) {
    return this.account.updatePassword(newPassword, currentPassword);
  }

  /**
   * send an email with a password reset URL to currently logged-in user
   * @remarks limited to 10 requests in every 60 minutes per email address
   * @param email
   * @returns {@link https://appwrite.io/docs/models/token Token Object}
   */
  createPasswordRecovery(email: string) {
    const redirectURL = "https://econotes.software-engineering.education/";
    return this.account.createRecovery(email, redirectURL);
  }

  /**
   * endpoint to complete the user account password reset
   * @remarks limited to 10 requests in every 60 minutes per email address
   * @param userId
   * @param secret Valid reset token.
   * @param password New user password. Must be at least 8 chars.
   */
  confirmPasswordRecovery(userId: string, secret: string, password: string) {
    return this.account.updateRecovery(userId, secret, password, password);
  }

  /**
   * update email currently logged-in user email address.
   * @param email
   * @param currentPassword Must be at least 8 chars.
   * @returns {@link https://appwrite.io/docs/models/account Account Object}
   */
  async updateAccountEmail(email: string, currentPassword: string) {
    return this.account.updateEmail(email, currentPassword);
  }

  /**
   * remove session from api
   * @param sessionId
   */
  async deleteAccountSession(sessionId: string): Promise<any> {
    return this.account.deleteSession(sessionId);
  }
}
