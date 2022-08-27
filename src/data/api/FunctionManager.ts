import { Client, Functions, Models } from "appwrite";

export default class FunctionManager {
  functions: Functions;

  constructor(client: Client) {
    this.functions = new Functions(client);
  }

  async createExecution(functionId: string): Promise<Models.Execution> {
    return this.functions.createExecution(functionId);
  }

  async getExecution(functionId: string, executionId: string) {
    return this.functions.getExecution(functionId, executionId);
  }
}
