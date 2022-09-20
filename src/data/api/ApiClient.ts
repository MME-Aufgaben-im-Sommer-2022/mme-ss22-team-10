import { Server } from "./config";
import { Client, Models, Query } from "appwrite";
import AccountManager from "./AccountManager";
import DatabaseManager from "./DatabaseManager";
import { TemplateItem } from "../models/UserSettingsModel";
import { BlockContent } from "../models/EditorModel";

/**
 * class that handles all REST API and session related functions
 */
export default class ApiClient {
  private static client: Client;
  private static accountManager: AccountManager;
  private static databaseManager: DatabaseManager;
  private static userId: string;
  private static sessionId: string;

  /**
   * initialize Client for account and database access
   */
  static async init() {
    this.client = new Client();
    this.client.setEndpoint(Server.ENDPOINT);
    this.client.setProject(Server.PROJECT_ID);
    this.accountManager = new AccountManager(this.client);
    this.databaseManager = new DatabaseManager(this.client, Server.DATABASE_ID);
  }

  /**
   * set sessionId and userId in this class and local storage
   * @param session
   */
  static connectSession(session: Models.Session): void {
    this.sessionId = session.$id;
    this.userId = session.userId;
    localStorage.setItem("sessionId", this.sessionId);
    localStorage.setItem("userId", this.userId);
  }

  /**
   * remove current sessionId and userId
   */
  static async disconnectCurrentSession(): Promise<void> {
    await this.removeSession(this.sessionId);
    this.userId = "";
    this.sessionId = "";
    localStorage.removeItem("sessionId");
    localStorage.removeItem("userId");
  }

  /**
   * get a session via id
   * @param sessionId
   * @returns {@link https://appwrite.io/docs/models/session Session Object}
   */
  static async getSession(sessionId: string): Promise<Models.Session> {
    return this.accountManager.getAccountSession(sessionId);
  }

  /**
   * create a session if email and password are valid
   * @param email
   * @param password
   * @returns {@link https://appwrite.io/docs/models/session Session Object}
   */
  static async createNewSession(
    email: string,
    password: string
  ): Promise<Models.Session> {
    return await this.accountManager.createNewAccountSession(email, password);
  }

  /**
   * remove session from api
   * @param sessionId
   * @private
   */
  private static async removeSession(sessionId: string): Promise<any> {
    return this.accountManager.deleteAccountSession(sessionId);
  }

  /**
   * get currently logged-in user data
   * @returns {@link https://appwrite.io/docs/models/user User Object}
   */
  static async getUserData(): Promise<Models.User<Models.Preferences>> {
    return this.accountManager.getAccountData();
  }

  /**
   * update name of currently logged-in user
   * @param username Max length: 128 chars
   * @returns {@link https://appwrite.io/docs/models/account Account Object}
   */
  static async updateUsername(username: string) {
    return this.accountManager.updateAccountName(username);
  }

  /**
   * update currently logged-in user password. For validation,
   * user is required to pass in the new password, and the old password.
   * @param newPassword Must be at least 8 chars.
   * @param currentPassword Must be at least 8 chars.
   * @returns {@link https://appwrite.io/docs/models/account Account Object}
   */
  static async updateUserPassword(
    newPassword: string,
    currentPassword: string
  ) {
    return this.accountManager.updateAccountPassword(
      newPassword,
      currentPassword
    );
  }

  /**
   * update email currently logged-in user email address.
   * @param email
   * @param currentPassword Must be at least 8 chars.
   * @returns {@link https://appwrite.io/docs/models/account Account Object}
   */
  static async updateUserEmail(email: string, currentPassword: string) {
    return this.accountManager.updateAccountEmail(email, currentPassword);
  }

  /**
   * creates new user
   * @remarks Only accepts 10 requests every 60 minutes per IP address
   * @param email
   * @param password
   * @param username
   * @returns {@link https://appwrite.io/docs/models/user User Object}
   */
  static async createAccount(
    email: string,
    password: string,
    username: string
  ): Promise<Models.User<Models.Preferences>> {
    return this.accountManager.createNewAccount(email, password, username);
  }

  /**
   * get the document used for the user settings
   * @returns {@link https://appwrite.io/docs/models/document Document Object}
   */
  static async getUserSettingsDocument(): Promise<Models.Document> {
    const userSettings = await this.databaseManager.listDocuments(
      Server.COLLECTION_SETTINGS,
      [Query.equal("userID", this.userId)]
    );
    return userSettings.documents[0];
  }

  /**
   * create a new document for the user settings
   * @param template
   * @returns {@link https://appwrite.io/docs/models/document Document Object}
   */
  static async createNewSettingsDocument(
    template: Array<TemplateItem>
  ): Promise<Models.Document> {
    return this.databaseManager.createNewDocument(Server.COLLECTION_SETTINGS, {
      userID: this.userId,
      template: template,
    });
  }

  /**
   * update the document used for the user settings
   * @param template
   * @returns {@link https://appwrite.io/docs/models/document Document Object}
   */
  static async updateUserSettingsDocument(
    template: Array<string>
  ): Promise<void> {
    const userSettings = await this.getUserSettingsDocument();
    this.databaseManager.updateDocument(
      Server.COLLECTION_SETTINGS,
      userSettings.$id,
      { template: template }
    );
  }

  /**
   * get document for an EditorModel object by day
   * @param day format: 'yyyy-mm-dd'
   * @returns {@link https://appwrite.io/docs/models/document Document Object}
   */
  static async getNoteDocument(day: string): Promise<Models.Document> {
    const noteDocument = await this.databaseManager.listDocuments(
      Server.COLLECTION_NOTES,
      [Query.equal("userID", this.userId), Query.equal("day", day)]
    );
    return noteDocument.documents[0];
  }

  /**
   * get all existing documents from a user
   * @returns array of {@link https://appwrite.io/docs/models/document Document Objects}
   */
  static async getNoteDocumentList(): Promise<Array<Models.Document>> {
    const noteDocumentArray: Array<Models.Document> = [],
      noteDocument = await this.databaseManager.listDocuments(
        Server.COLLECTION_NOTES,
        [Query.equal("userID", this.userId)]
      ),
      noteDocumentLength = noteDocument.total;
    if (noteDocumentLength !== 0) {
      let lastDocumentId =
        noteDocument.documents[noteDocument.documents.length - 1].$id;
      noteDocument.documents.forEach((document) =>
        noteDocumentArray.push(document)
      );
      // the loop is needed, as only 100 documents can be fetched at once
      while (noteDocumentArray.length < noteDocumentLength) {
        const noteDocument = await this.databaseManager.listDocuments(
          Server.COLLECTION_NOTES,
          [Query.equal("userID", this.userId)],
          lastDocumentId
        );
        lastDocumentId =
          noteDocument.documents[noteDocument.documents.length - 1].$id;
        noteDocument.documents.forEach((document) =>
          noteDocumentArray.push(document)
        );
      }
    }
    return noteDocumentArray;
  }

  /**
   * get a list of documents containing data for an EditorModel object's BlockContents
   * @param noteId
   * @returns {@link https://appwrite.io/docs/models/documentList Document List Object}
   */
  static async getBlockContentDocumentList(
    noteId: string
  ): Promise<Models.DocumentList<Models.Document>> {
    return await this.databaseManager.listDocuments(
      Server.COLLECTION_BLOCK_CONTENTS,
      [Query.equal("noteID", noteId)]
    );
  }

  /**
   * get a generated title based on given Notes (list of BlockContents)
   * @param blockContents
   * @returns {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response} object
   * @remarks generated title can be accessed via response.gptTitle
   */
  static async getGeneratedTitle(
    blockContents: Array<Models.Document>
  ): Promise<any> {
    const url = "https://gpt-title.deno.dev/",
      method = "POST",
      headers = {
        "Content-Type": "application/json; charset=utf-8",
      };
    return await fetch(url, {
      headers: headers,
      method: method,
      body: JSON.stringify({ blockContents }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * create a new document for an EditorModel object
   * @param day
   * @returns {@link https://appwrite.io/docs/models/document Document Object}
   */
  static async createNewNoteDocument(day: string): Promise<Models.Document> {
    return this.databaseManager.createNewDocument(Server.COLLECTION_NOTES, {
      userID: this.userId,
      day: day,
    });
  }

  /**
   * create a new document for a BlockContent object
   * @param noteId
   * @param blockContent
   * @returns {@link https://appwrite.io/docs/models/document Document Object}
   */
  static async createNewBlockContentDocument(
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

  /**
   * update a BlockContent document
   * @param blockContentId
   * @param blockContent
   * @returns {@link https://appwrite.io/docs/models/document Document Object}
   */
  static async updateBlockContentDocument(
    documentId: string,
    blockContent: { title: string; inputType: string; inputValue: string }
  ): Promise<Models.Document> {
    return this.databaseManager.updateDocument(
      Server.COLLECTION_BLOCK_CONTENTS,
      documentId,
      blockContent
    );
  }

  /**
   * delete a note document
   * @param noteId
   */
  static async deleteNoteDocument(noteId: string): Promise<void> {
    this.databaseManager.deleteDocument(Server.COLLECTION_NOTES, noteId);
  }

  /**
   * delete the BlockContent documents belonging to a note document
   * @param noteId
   */
  static async deleteBlockContents(noteId: string): Promise<void> {
    const blockContents = await this.getBlockContentDocumentList(noteId);
    blockContents.documents.forEach((blockContent) => {
      this.databaseManager.deleteDocument(
        Server.COLLECTION_BLOCK_CONTENTS,
        blockContent.$id
      );
    });
  }
}
