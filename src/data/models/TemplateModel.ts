import Model from "../../lib/data/Model";

export interface Topic {
  name: string;
  titles: Array<string>;
}

export default class TemplateModel extends Model {
  topics: Array<Topic>;

  constructor(topics: Array<Topic>) {
    super();
    this.topics = topics;
  }
}
