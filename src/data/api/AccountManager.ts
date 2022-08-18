import { Account, Client } from "appwrite";

export default class AccountManager {
  account: Account;
  sessionId: string;

  constructor(client: Client) {
    this.account = new Account(client);
    this.sessionId = "";
  }

  createNewAccount(email: string, password: string, name: string) {
    const promise: Promise<any> = this.account.create(
      "unique()",
      email,
      password,
      name
    );
    promise.then(
      (response) => {
        console.log(response);
        this.createNewAccountSession(email, password);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // login User
  createNewAccountSession(email: string, password: string) {
    const promise: Promise<any> = this.account.createEmailSession(
      email,
      password
    );
    promise.then(
      (response) => {
        // returns session Object : https://appwrite.io/docs/models/session
        console.log(response);
        this.sessionId = response.$id;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // get currently logged in user data
  getAccountData() {
    const promise: Promise<any> = this.account.get();
    promise.then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // logs out user
  deleteAccountSession() {
    const promise: Promise<any> = this.account.deleteSession(this.sessionId);
    promise.then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
