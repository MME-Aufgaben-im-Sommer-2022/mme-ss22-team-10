import { Server } from "./config";
import { Client } from "appwrite";
import AccountManager from "./AccountManager";
import DatabaseManager from "./DatabaseManager";

export default class ApiClient {
  client: Client;
  accountManager: AccountManager;
  databaseManager: DatabaseManager;

  constructor() {
    this.client = new Client();
    this.client.setEndpoint(Server.ENDPOINT);
    this.client.setProject(Server.PROJECT_ID);
    this.accountManager = new AccountManager(this.client);
    this.databaseManager = new DatabaseManager(this.client, Server.DATABASE_ID);
  }
}
