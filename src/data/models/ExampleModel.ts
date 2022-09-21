import Model from "../../lib/data/Model";

/**
 * @class ExampleModel
 * Example model, used for learning purposes at the beginning of the project
 */
export default class ExampleModel extends Model {
  name: string;
  count: number;

  constructor(name: string, count: number) {
    super();
    this.name = name;
    this.count = count;
  }
}
