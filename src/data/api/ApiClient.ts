import { Server } from "./config";
import { Client, Models, Query } from "appwrite";
import AccountManager from "./AccountManager";
import DatabaseManager from "./DatabaseManager";
import { TemplateItem } from "../models/UserSettingsModel";
import EditorModel, { BlockContent } from "../models/EditorModel";

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

  static connectSession(session: Models.Session) {
    this.sessionId = session.$id;
    this.userId = session.userId;
    localStorage.setItem("sessionId", this.sessionId);
    localStorage.setItem("userId", this.userId);
  }

  static async disconnectCurrentSession() {
    await this.removeSession(this.sessionId);
    this.userId = "";
    this.sessionId = "";
    localStorage.removeItem("sessionId");
    localStorage.removeItem("userId");
  }

  static async getSession(sessionId: string): Promise<Models.Session> {
    return this.accountManager.getAccountSession(sessionId);
  }

  static async createNewSession(
    _email: string,
    _password: string
  ): Promise<Models.Session> {
    return await this.accountManager.createNewAccountSession(
      Server.TEST_USER_EMAIL,
      Server.TEST_USER_PASSWORD
    );
  }

  private static async removeSession(sessionId: string): Promise<any> {
    return this.accountManager.deleteAccountSession(sessionId);
  }

  static async getAccountData(): Promise<Models.User<Models.Preferences>> {
    return this.accountManager.getAccountData();
  }

  private static async getUserSettingsDocument(): Promise<Models.Document> {
    const userSettings = await this.databaseManager.listDocuments(
      Server.COLLECTION_SETTINGS,
      [Query.equal("userID", this.userId)]
    );
    return userSettings.documents[0];
  }

  static async getUserTemplate(): Promise<Array<string>> {
    const userSettings = await this.getUserSettingsDocument();
    return userSettings.template;
  }

  static async createUserTemplate(
    template: Array<TemplateItem>
  ): Promise<Models.Document> {
    return this.databaseManager.createNewDocument(Server.COLLECTION_SETTINGS, {
      userID: this.userId,
      template: template,
    });
  }

  static async updateUserTemplate(template: Array<string>) {
    const userSettings = await this.getUserSettingsDocument();
    this.databaseManager.updateDocument(
      Server.COLLECTION_SETTINGS,
      userSettings.$id,
      { template: template }
    );
  }

  private static async getNoteDocument(day: Date): Promise<Models.Document> {
    const noteDocument = await this.databaseManager.listDocuments(
      Server.COLLECTION_NOTES,
      [
        Query.equal("userID", this.userId),
        Query.equal("day", this.convertDateToString(day)),
      ]
    );
    return noteDocument.documents[0];
  }

  static async getNoteDays() {
    const maxDay: Date = new Date(),
      minDay: Date = new Date(),
      array: Array<any> = [];
    let noteDocument;
    minDay.setMonth(minDay.getMonth() - 3);

    for (let i = 0; i < 4; i++) {
      noteDocument = await this.databaseManager.listDocuments(
        Server.COLLECTION_NOTES,
        [
          Query.equal("userID", this.userId),
          Query.greater("day", this.convertDateToString(minDay)),
          Query.lesserEqual("day", this.convertDateToString(maxDay)),
        ]
      );
      maxDay.setMonth(maxDay.getMonth() - 3);
      minDay.setMonth(minDay.getMonth() - 3);
      noteDocument.documents.forEach((document) => array.push(document));
    }
    return array;
  }

  private static async getBlockContentsDocuments(
    noteID: string
  ): Promise<Array<BlockContent>> {
    const blockContents: Array<BlockContent> = [],
      promise = await this.databaseManager.listDocuments(
        Server.COLLECTION_BLOCK_CONTENTS,
        [Query.equal("noteID", noteID)]
      );
    promise.documents.forEach((entry) => {
      blockContents.push(<BlockContent>{
        title: entry.title,
        inputType: entry.inputType,
        inputValue: "",
      });
    });
    return blockContents;
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
      blockContents = await this.getBlockContentsDocuments(noteDocument.$id);
    return { day: date, blockContents: blockContents };
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

  static async deleteEditorNotes(noteId: string) {
    const blockContents = await this.databaseManager.listDocuments(
      Server.COLLECTION_BLOCK_CONTENTS,
      [Query.equal("noteID", noteId)]
    );
    this.databaseManager.deleteDocument(Server.COLLECTION_NOTES, noteId);
    blockContents.documents.forEach((blockContent) => {
      this.databaseManager.deleteDocument(
        Server.COLLECTION_BLOCK_CONTENTS,
        blockContent.$id
      );
    });
  }

  private static convertDateToString(date: Date): string {
    return [
      date.getFullYear(),
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1,
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
    ].join("-");
  }
}
