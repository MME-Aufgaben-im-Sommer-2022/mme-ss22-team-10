import { Client, Databases } from "appwrite";

export default class DatabaseManager {
  database: Databases;

  constructor(client: Client, databaseId: string) {
    this.database = new Databases(client, databaseId);
  }

  createNewDocument(collection: string, data: any) {
    const promise: Promise<any> = this.database.createDocument(
      collection,
      "unique()",
      data
    );
    promise.then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  listDocuments(database: string, collection: string, query: any) {
    const promise: Promise<any> = this.database.createDocument(
      database,
      collection,
      query
    );
    promise.then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateDocument(collection: string, document: string, data: any) {
    const promise: Promise<any> = this.database.updateDocument(
      collection,
      document,
      data
    );
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
