import { Client, Databases, Models } from "appwrite";

const MAX_NUMBER_OF_DOCUMENTS = 100;
/**
 * class that contains basic function from the Database API
 * @see {@link https://appwrite.io/docs/client/databases?sdk=web-default Database API}
 */
export default class DatabaseManager {
  database: Databases;

  /**
   * initialize a new instance of the Database class
   * @param client
   * @param databaseId
   */
  constructor(client: Client, databaseId: string) {
    this.database = new Databases(client, databaseId);
  }

  /**
   * create a new Document
   * @param collectionId
   * @param data contains collection attributes and values
   * @returns {@link https://appwrite.io/docs/models/document Document Object}
   */
  async createNewDocument(
    collectionId: string,
    data: any
  ): Promise<Models.Document> {
    return this.database.createDocument(collectionId, "unique()", data);
  }

  /**
   * get a list of all documents in a collection which match given queries
   * @remarks can only fetch a total number of 100 documents
   * @param collectionId
   * @param queryList list of {@link https://appwrite.io/docs/databases#querying-documents queries}
   * @param cursor id of document which will be used as starting point. for more see {@link https://appwrite.io/docs/pagination#cursor-pagination cursor pagination}
   * @returns {@link https://appwrite.io/docs/models/documentList Document List Object}
   */
  async listDocuments(
    collectionId: string,
    queryList: Array<any>,
    cursor?: string
  ): Promise<Models.DocumentList<Models.Document>> {
    return this.database.listDocuments(
      collectionId,
      queryList,
      MAX_NUMBER_OF_DOCUMENTS,
      0,
      cursor
    );
  }

  /**
   * get a document
   * @param collectionId
   * @param documentId
   * @returns {@link https://appwrite.io/docs/models/document Document Object}
   */
  async getDocument(
    collectionId: string,
    documentId: string
  ): Promise<Models.Document> {
    return this.database.getDocument(collectionId, documentId);
  }

  /**
   * update a document
   * @param collectionId
   * @param documentId
   * @param data Document data as JSON object. Include only attribute and value pairs to be updated.
   * @returns {@link https://appwrite.io/docs/models/document Document Object}
   */
  async updateDocument(
    collectionId: string,
    documentId: string,
    data: any
  ): Promise<Models.Document> {
    return this.database.updateDocument(collectionId, documentId, data);
  }

  /**
   * delete a document
   * @param collectionId
   * @param documentId
   */
  async deleteDocument(collectionId: string, documentId: string) {
    return this.database.deleteDocument(collectionId, documentId);
  }
}
