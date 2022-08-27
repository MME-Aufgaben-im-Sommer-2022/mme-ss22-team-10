/* eslint-disable */
import WebComponent from "../../lib/components/WebComponent";
import html from "./Playground.html";
import css from "./Playground.css";
import Home from "../Home/Home";
import DataManager from "../../data/DataManager";
import { log } from "../../lib/utils/Logger";
import TemplateConfigurator from "../TemplateConfigurator/TemplateConfigurator";

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
    const templateConfigModel =
      DataManager.getTemplateConfigurationModel().then((model) => {
        log(model);
        this.appendChild(new TemplateConfigurator(model.toState()));
      });
  }
}
