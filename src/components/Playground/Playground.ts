/* eslint-disable */
import WebComponent from "../../lib/components/WebComponent";
import html from "./Playground.html";
import css from "./Playground.css";
import Home from "../Home/Home";
import Login from "../Login/Login";

export default class Playground extends WebComponent {
  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
    return "dev-playground";
  }

  onCreate(): Promise<void> | void {
    //const homeComponent = new Home();
    //this.appendChild(homeComponent);
    const login = new Login();
    this.appendChild(login);
  }
}
