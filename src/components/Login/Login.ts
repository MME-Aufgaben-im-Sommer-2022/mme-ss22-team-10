import WebComponent from "../../lib/components/WebComponent";
import html from "../Login/Login.html";
import css from "../Login/Login.css";

export default class Login extends WebComponent {
  constructor() {
    super(html, css);
  }

  // override htmlTagName to return the tag name our component
  // -> <example-component /> can be used in the html to create a new instance of this component
  get htmlTagName(): string {
    return "login-register";
  }

  onCreate(): void {}
}
