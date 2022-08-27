import WebComponent from "../../lib/components/WebComponent";
import State from "../../lib/state/State";
import EditorModel from "../../data/models/EditorModel";
import DataManager from "../../data/DataManager";
import Editor from "../Editor/Editor/Editor";
import Calendar from "../Calendar/Calendar/Calendar";
import html from "./Home.html";
import css from "./Home.css";
import CalendarModel from "../../data/models/CalendarModel";
import { log } from "../../lib/utils/Logger";

export default class Home extends WebComponent {
  private $contentContainer!: HTMLDivElement;
  private $editor!: Editor;
  private $calendar!: Calendar;

  private editorModelState!: State<EditorModel>;
  private calendarModel!: CalendarModel;

  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
    return "home-component";
  }

  onCreate(): Promise<void> | void {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      this.calendarModel = await DataManager.getCalendarModel();
      const editorModel = await DataManager.getEditorModel(new Date());
      this.editorModelState = editorModel.toState();
      this.$initHtml();
      this.initListener();
      resolve();
    });
  }
  private $initHtml(): void {
    this.$contentContainer = this.select("#home-container-content")!;
    this.$editor = new Editor(this.editorModelState);
    this.$calendar = new Calendar(this.calendarModel);

    this.$contentContainer.appendChild(this.$calendar);
    this.$contentContainer.appendChild(this.$editor);
  }

  initListener(): void {
    // todo
  }
}
