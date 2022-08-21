import { Server } from "./config";
import { Client, Models, Query } from "appwrite";
import AccountManager from "./AccountManager";
import DatabaseManager from "./DatabaseManager";
import { TemplateItem } from "../models/UserSettingsModel";
import EditorModel from "../models/EditorModel";

export default class ApiClient {
  private static client: Client;
  private static accountManager: AccountManager;
  private static databaseManager: DatabaseManager;
  private static userId: string;
  private static sessionId: string;

  static async init() {
    this.client = new Client();
    this.client.setEndpoint(Server.ENDPOINT);
    this.client.setProject(Server.PROJECT_ID);
    this.accountManager = new AccountManager(this.client);
    this.databaseManager = new DatabaseManager(this.client, Server.DATABASE_ID);
  }

  static async logInUser(email: string, password: string) {
    const sessionExpired = await this.localSessionIsExpired();
    if (sessionExpired) {
      await this.createNewSession(email, password);
    }
  }

  private static async localSessionIsExpired(): Promise<boolean> {
    this.sessionId = localStorage.getItem("sessionId")!;
    if (this.sessionId !== null) {
      const sessionPromise = await this.accountManager.getAccountSession(
        this.sessionId
      );
      this.userId = sessionPromise.userId;
      return new Date(sessionPromise.expire * 1000) <= new Date();
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  static async createNewSession(email: string, password: string) {
    const accountSession = await this.accountManager.createNewAccountSession(
      Server.TEST_USER_EMAIL, // email
      Server.TEST_USER_PASSWORD // password
    );
    this.sessionId = accountSession.$id;
    this.userId = accountSession.userId;
    localStorage.setItem("sessionId", accountSession.$id);
    localStorage.setItem("userId", accountSession.userId);
  }

  static async logOutUser(): Promise<any> {
    this.userId = "";
    this.sessionId = "";
    localStorage.removeItem("sessionId");
    localStorage.removeItem("userId");
    return this.accountManager.deleteAccountSession(this.sessionId);
  }

  static async getUsername(): Promise<string> {
    const accountData = await this.accountManager.getAccountData();
    return accountData.name;
  }

  private static async getUserSettingsDocument(): Promise<Models.Document> {
    const userSettings = await this.databaseManager.listDocuments(
      Server.COLLECTION_SETTINGS,
      [Query.equal("userID", this.userId)]
    );
    return userSettings.documents[0];
  }

  static async getUserTemplate() {
    const userSettings = await this.getUserSettingsDocument();
    return this.jsonParseArray(userSettings.template);
  }

  static async createUserTemplate(
    template: Array<TemplateItem>
  ): Promise<Models.Document> {
    return await this.databaseManager.createNewDocument(
      Server.COLLECTION_SETTINGS,
      { userID: this.userId, template: template }
    );
  }

  static async updateUserTemplate(template: Array<TemplateItem>) {
    const userSettings = await this.getUserSettingsDocument();
    this.databaseManager.updateDocument(
      Server.COLLECTION_SETTINGS,
      userSettings.$id,
      { template: this.stringifyArray(template) }
    );
  }

  private static async getNoteDocument(day: Date): Promise<Models.Document> {
    const noteDocument = await this.databaseManager.listDocuments(
      Server.COLLECTION_NOTES,
      [Query.equal("day", this.convertDateToString(day))]
    );
    return noteDocument.documents[0];
  }

  private static async getBlockContentsDocuments(
    noteID: string
  ): Promise<any[]> {
    const blockContents = await this.databaseManager.listDocuments(
      Server.COLLECTION_BLOCK_CONTENTS,
      [Query.equal("noteID", noteID)]
    );
    return blockContents.documents;
  }

  private static async getBlockContentDocument(
    noteID: string,
    title: string
  ): Promise<Models.Document> {
    const blockContents = await this.databaseManager.listDocuments(
      Server.COLLECTION_BLOCK_CONTENTS,
      [Query.equal("noteID", noteID), Query.equal("title", title)]
    );
    return blockContents.documents[0];
  }

  static async getEditorNotes(date: Date) {
    const noteDocument = await this.getNoteDocument(date),
      day = new Date(noteDocument.$createdAt * 1000),
      blockContents = await this.getBlockContentsDocuments(noteDocument.$id);
    return { day: day, blockContents: blockContents };
  }

  static async createEditorNotes(editorModel: EditorModel) {
    const noteDocument = await this.databaseManager.createNewDocument(
      Server.COLLECTION_NOTES,
      {
        userID: this.userId,
        day: this.convertDateToString(editorModel.day),
      }
    );
    editorModel.blockContents.forEach(async (blockContent) => {
      this.databaseManager.createNewDocument(Server.COLLECTION_BLOCK_CONTENTS, {
        noteID: noteDocument.$id,
        title: blockContent.title,
        inputType: blockContent.inputType,
        inputValue: blockContent.inputValue,
      });
    });
  }

  static async updateEditorNotes(editorModel: EditorModel) {
    const noteDocument = await this.getNoteDocument(editorModel.day);
    editorModel.blockContents.forEach(async (blockContent) => {
      const blockContentDocument = await this.getBlockContentDocument(
        noteDocument.$id,
        blockContent.title
      );
      this.databaseManager.updateDocument(
        Server.COLLECTION_BLOCK_CONTENTS,
        blockContentDocument.$id,
        blockContent
      );
    });
  }

  private static convertDateToString(date: Date): string {
    return [
      date.getFullYear(),
      date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth(),
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
    ].join("");
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
