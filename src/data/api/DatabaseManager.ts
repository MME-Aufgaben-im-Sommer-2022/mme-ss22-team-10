import { Client, Databases, Models } from "appwrite";

export default class DatabaseManager {
  database: Databases;

  constructor(client: Client, databaseId: string) {
    this.database = new Databases(client, databaseId);
  }

  async createNewDocument(
    collection: string,
    data: any
  ): Promise<Models.Document> {
    return this.database.createDocument(collection, "unique()", data);
  }

  async listDocuments(
    collection: string,
    query: Array<any>
  ): Promise<Models.DocumentList<Models.Document>> {
    return this.database.listDocuments(collection, query);
  }

  async updateDocument(
    collection: string,
    document: string,
    data: any
  ): Promise<Models.Document> {
    return this.database.updateDocument(collection, document, data);
  }
}
