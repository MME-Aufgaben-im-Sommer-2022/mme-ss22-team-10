import WebComponent from "../../lib/components/WebComponent";
import html from "./Home.html";
import css from "./Home.css";
import EventBus from "../../lib/events/EventBus";
import Editor from "../Editor/Editor/Editor";
import State from "../../lib/state/State";
import { STATE_CHANGE_EVENT } from "../../events/StateChanged";
import TemplateConfigurator from "../TemplateConfigurator/TemplateConfigurator";
import { GlobalStates } from "../../state/GlobalStates";
import GlobalState from "../../lib/state/GlobalState";
import UserSettingsModel from "../../data/models/UserSettingsModel";
import { ToastFactory } from "../atomics/Toast/ToastFactory";
import { ToastDuration, ToastType } from "../atomics/Toast/Toast";

export default class Home extends WebComponent {
  private $templateEditorContainer!: HTMLDivElement;
  private $bgDimmer!: HTMLDivElement;
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
    this.$bgDimmer = this.select("#template-configurator-background-dimmer")!;
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
    this.$bgDimmer.addEventListener("click", () => {
      this.isShowingTemplateEditorState.value = false;
    });
  }

  private onFinishedTemplateConfiguration = () => {
    this.isShowingTemplateEditorState.value = false;
    new ToastFactory()
      .setMessage("Your template has been saved")
      .setType(ToastType.Success)
      .setDuration(ToastDuration.Short)
      .show();
  };

  private toggleTemplateEditor = (): void => {
    if (this.isShowingTemplateEditorState.value) {
      this.$templateEditorContainer.hidden = false;
      const userSettings = GlobalState.getStateById<UserSettingsModel>(
          GlobalStates.userSettingsModel
        )?.value,
        $templateConfigurator = new TemplateConfigurator(
          userSettings?.settings?.template
        );

      $templateConfigurator.addEventListener(
        TemplateConfigurator.FINISH_TEMPLATE_CONFIGURATION_EVENT,
        () => this.onFinishedTemplateConfiguration()
      );
      this.$templateEditorContainer.appendChild($templateConfigurator);
      this.$bgDimmer.hidden = false;
    } else {
      this.$templateEditorContainer.classList.remove("slide-up-in");
      this.$templateEditorContainer.classList.add("slide-down-out");
      this.$bgDimmer.classList.remove("fade-in");
      this.$bgDimmer.classList.add("fade-out");
      setTimeout(() => this.$hideTemplateEditor(), 300);
      new ToastFactory()
        .setMessage("🗑️ Your changes have been discarded")
        .setType(ToastType.Info)
        .setDuration(ToastDuration.Short)
        .show();
    }
  };

  private $hideTemplateEditor(): void {
    this.$templateEditorContainer.classList.remove("slide-down-out");
    this.$templateEditorContainer.classList.add("slide-up-in");
    this.$bgDimmer.classList.remove("fade-out");
    this.$bgDimmer.classList.add("fade-in");
    this.$templateEditorContainer.hidden = true;
    this.$templateEditorContainer.innerHTML = "";
    this.$bgDimmer.hidden = true;
  }
}
