import WebComponent from "../../lib/components/WebComponent";
import html from "./Home.html";
import css from "./Home.css";
import EventBus from "../../lib/events/EventBus";
import Editor from "../Editor/Editor/Editor";
import TemplateConfigurator from "../TemplateConfigurator/TemplateConfigurator";
import Modal from "../atomics/Modal/Modal";
import ModalFactory from "../atomics/Modal/ModalFactory";
import UserSettingsModel from "../../data/models/UserSettingsModel";
import GlobalState from "../../lib/state/GlobalState";
import { GlobalStates } from "../../state/GlobalStates";
import State from "../../lib/state/State";

/**
 * @class Home
 * The home (main) page of the app.
 */
export default class Home extends WebComponent {
  private $templateConfiguratorModal!: Modal<TemplateConfigurator>;
  private userSettings?: State<UserSettingsModel>;

  constructor() {
    super(html, css);
    this.userSettings = GlobalState.getStateById(
      GlobalStates.userSettingsModel
    );
  }

  get htmlTagName(): string {
    return "home-component";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListener();
  }

  $initHtml(): void {
    this.$templateConfiguratorModal = new ModalFactory<TemplateConfigurator>()
      .setContent(
        new TemplateConfigurator(this.userSettings?.value.settings?.template)
      )
      .build();
  }

  private initListener(): void {
    EventBus.addEventListener(Editor.EDIT_TEMPLATE_CLICKED_EVENT, () =>
      this.$templateConfiguratorModal.toggle()
    );
  }
}
