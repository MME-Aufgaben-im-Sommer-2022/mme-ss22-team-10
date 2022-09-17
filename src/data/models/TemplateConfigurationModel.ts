import Model from "../../lib/data/Model";
import { TemplateItem } from "./UserSettingsModel";

export interface Topic {
  name: string;
  items: Array<TemplateItem>;
}

export default class TemplateConfigurationModel extends Model {
  topics: Array<Topic>;

  constructor(topics: Array<Topic>) {
    super();
    this.topics = topics;
  }
}
