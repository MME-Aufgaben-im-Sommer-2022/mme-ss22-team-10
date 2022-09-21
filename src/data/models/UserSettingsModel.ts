import Model from "../../lib/data/Model";

/**
 * A template consists of multiple {@link TemplateItem}s
 */
export type Template = Array<TemplateItem>;

/**
 * A single item of a {@link Template}
 */
export interface TemplateItem {
  title: string;
  inputType: string;
}

/**
 * A model that stores all user settings & the username
 */
export default class UserSettingsModel extends Model {
  username: string;
  /**
   * Settings currently only include the template
   */
  settings: {
    template: Template;
  };

  constructor(
    username: string,
    settings: {
      template: Template;
    }
  ) {
    super();
    this.username = username;
    this.settings = settings;
  }
}
