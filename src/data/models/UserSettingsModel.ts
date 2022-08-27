import Model from "../../lib/data/Model";

export type Template = Array<TemplateItem>;

export interface TemplateItem {
  title: string;
  inputType: string;
}

export default class UserSettingsModel extends Model {
  username: string;
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
