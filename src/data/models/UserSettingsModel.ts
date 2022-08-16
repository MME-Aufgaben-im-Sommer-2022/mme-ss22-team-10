import Model from "../../lib/data/Model";

export default class UserSettingsModel extends Model {
  username: string;
  token: string;
  settings: Array<{
    template: Array<{
      title: string;
      inputType: string;
      inputValue: string;
    }>;
  }>;

  constructor(
    username: string,
    token: string,
    settings: Array<{
      template: Array<{
        title: string;
        inputType: string;
        inputValue: string;
      }>;
    }>
  ) {
    super();
    this.username = username;
    this.token = token;
    this.settings = settings;
  }
}
