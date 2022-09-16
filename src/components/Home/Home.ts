import WebComponent from "../../lib/components/WebComponent";
import html from "./Home.html";
import css from "./Home.css";
import EventBus from "../../lib/events/EventBus";
import Editor from "../Editor/Editor/Editor";
import State from "../../lib/state/State";
import { STATE_CHANGE_EVENT } from "../../events/StateChanged";
import TemplateConfigurator from "../TemplateConfigurator/TemplateConfigurator";

export default class Home extends WebComponent {
  private $templateEditorContainer!: HTMLDivElement;
  private $templateConfiguratorBackroundDimmer!: HTMLDivElement;
  private isShowingTemplateEditorState = new State(false);

  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
    return "home-component";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListener();
  }

  $initHtml(): void {
    this.$templateEditorContainer = this.select("#template-editor-container")!;
    this.$templateConfiguratorBackroundDimmer = this.select(
      "#template-configurator-background-dimmer"
    )!;
  }

  private initListener(): void {
    EventBus.addEventListener(Editor.EDIT_TEMPLATE_CLICKED_EVENT, () => {
      this.isShowingTemplateEditorState.value =
        !this.isShowingTemplateEditorState.value;
    });
    this.isShowingTemplateEditorState.addEventListener(
      STATE_CHANGE_EVENT,
      this.toggleTemplateEditor
    );
    this.$templateConfiguratorBackroundDimmer.addEventListener("click", () => {
      this.isShowingTemplateEditorState.value = false;
    });
  }

  private toggleTemplateEditor = (): void => {
    this.$templateEditorContainer.hidden =
      !this.isShowingTemplateEditorState.value;
    if (this.isShowingTemplateEditorState.value) {
      const $templateConfigurator = new TemplateConfigurator();
      this.$templateEditorContainer.appendChild($templateConfigurator);
      this.$templateConfiguratorBackroundDimmer.hidden = false;
    } else {
      this.$templateEditorContainer.innerHTML = "";
      this.$templateConfiguratorBackroundDimmer.hidden = true;
    }
  };
}
