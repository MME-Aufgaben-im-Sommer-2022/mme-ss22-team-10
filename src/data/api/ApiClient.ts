import { Server } from "./config";
import { Client, Models, Query } from "appwrite";
import AccountManager from "./AccountManager";
import DatabaseManager from "./DatabaseManager";
import { TemplateItem } from "../models/UserSettingsModel";
import { BlockContent } from "../models/EditorModel";

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

  static async getNoteDocument(day: string): Promise<Models.Document> {
    const noteDocument = await this.databaseManager.listDocuments(
      Server.COLLECTION_NOTES,
      [Query.equal("userID", this.userId), Query.equal("day", day)]
    );
    return noteDocument.documents[0];
  }

  static async getNoteDays() {
    const array: Array<any> = [],
      noteDocument = await this.databaseManager.listDocuments(
        Server.COLLECTION_NOTES,
        [Query.equal("userID", this.userId)]
      ),
      noteDocumentLength = noteDocument.total;
    let lastDocumentId =
      noteDocument.documents[noteDocument.documents.length - 1].$id;
    noteDocument.documents.forEach((document) => array.push(document));

    while (array.length < noteDocumentLength) {
      const noteDocument = await this.databaseManager.listDocuments(
        Server.COLLECTION_NOTES,
        [Query.equal("userID", this.userId)],
        lastDocumentId
      );
      lastDocumentId =
        noteDocument.documents[noteDocument.documents.length - 1].$id;
      noteDocument.documents.forEach((document) => array.push(document));
    }
    return array;
  }

  static async getBlockContentsDocuments(
    noteId: string
  ): Promise<Models.DocumentList<Models.Document>> {
    return await this.databaseManager.listDocuments(
      Server.COLLECTION_BLOCK_CONTENTS,
      [Query.equal("noteID", noteId)]
    );
  }

  static async getSingleBlockContentDocument(
    noteID: string,
    title: string
  ): Promise<Models.Document> {
    const blockContents = await this.databaseManager.listDocuments(
      Server.COLLECTION_BLOCK_CONTENTS,
      [Query.equal("noteID", noteID), Query.equal("title", title)]
    );
    return blockContents.documents[0];
  }

  static async createNewNote(day: string): Promise<Models.Document> {
    return this.databaseManager.createNewDocument(Server.COLLECTION_NOTES, {
      userID: this.userId,
      day: day,
    });
  }

  static async createNewBlockContent(
    noteId: string,
    blockContent: BlockContent
  ): Promise<Models.Document> {
    return this.databaseManager.createNewDocument(
      Server.COLLECTION_BLOCK_CONTENTS,
      {
        noteID: noteId,
        title: blockContent.title,
        inputType: blockContent.inputType,
        inputValue: blockContent.inputValue,
      }
    );
  }

  static async updateBlockContent(
    blockContentId: string,
    blockContent: BlockContent
  ): Promise<Models.Document> {
    return this.databaseManager.updateDocument(
      Server.COLLECTION_BLOCK_CONTENTS,
      blockContentId,
      blockContent
    );
  }

  static async deleteNoteDocument(noteId: string): Promise<void> {
    this.databaseManager.deleteDocument(Server.COLLECTION_NOTES, noteId);
  }

  static async deleteBlockContents(noteId: string): Promise<void> {
    const blockContents = await this.getBlockContentsDocuments(noteId);
    blockContents.documents.forEach((blockContent) => {
      this.databaseManager.deleteDocument(
        Server.COLLECTION_BLOCK_CONTENTS,
        blockContent.$id
      );
    });
  }
}
