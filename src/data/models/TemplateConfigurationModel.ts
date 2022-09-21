import Model from "../../lib/data/Model";
import { TemplateItem } from "./UserSettingsModel";

/**
 * A single topic of the {@link TemplateConfigurationModel}
 */
export interface Topic {
  name: string;
  items: Array<TemplateItem>;
}

/**
 * Model, which stores the available topics / items in the {@link TemplateConfigurator}
 */
export default class TemplateConfigurationModel extends Model {
  topics: Array<Topic>;

  constructor(topics: Array<Topic>) {
    super();
    this.topics = topics;
  }
}
