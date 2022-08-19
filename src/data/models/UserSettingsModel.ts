import Model from "../../lib/data/Model";

export type Template = Array<TemplateItem>;

export interface TemplateItem {
  title: string;
  inputType: string;
}

export default class UserSettingsModel extends Model {
  username: string;
  token: string;
  settings: {
    template: Template;
  };

  constructor(
    username: string,
    token: string,
    settings: {
      template: Template;
    }
  ) {
    super();
    this.username = username;
    this.token = token;
    this.settings = settings;
  }
}
