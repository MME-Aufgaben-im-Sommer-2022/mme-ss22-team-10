import WebComponent from "../../lib/components/WebComponent";
import State from "../../lib/state/State";
import EditorModel from "../../data/models/EditorModel";
import DataManager from "../../data/DataManager";
import Editor from "../Editor/Editor/Editor";
import Calendar from "../Calendar/Calendar/Calendar";
import html from "./Home.html";
import css from "./Home.css";

export default class Home extends WebComponent {
  private $contentContainer!: HTMLDivElement;
  private $editor!: Editor;
  private $calendar!: Calendar;

  private editorModelState!: State<EditorModel>;

  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
    return "home-component";
  }

  onCreate(): void {
    DataManager.getEditorModel(new Date()).then((editorModel) => {
      this.editorModelState = new State(editorModel);
      this.$initHtml();
      this.initListener();
    });
  }
  private $initHtml(): void {
    this.$contentContainer = this.select("#home-container-content")!;
    this.$editor = new Editor(this.editorModelState);
    this.$calendar = new Calendar();

    this.$contentContainer.appendChild(this.$calendar);
    this.$contentContainer.appendChild(this.$editor);
  }

  initListener(): void {
    // todo
  }
}
