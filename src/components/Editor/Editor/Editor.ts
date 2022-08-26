import WebComponent from "../../../lib/components/WebComponent";
import html from "./Editor.html";
import EditorBlock from "../EditorBlock/EditorBlock";
import State from "../../../lib/state/State";
import EditorModel from "../../../data/models/EditorModel";
import EventBus from "../../../lib/events/EventBus";
import css from "./Editor.css";
import { CLOSE_ALL_EDITOR_INPUTS_EVENT } from "../../../events/CloseAllEditorInputs";

// HTML element that serves as the main editor component

// Necessary constructor parameters:
// - editorModelState:
//    - a state object that holds the editor model

export default class Editor extends WebComponent {
  private readonly editorModelState: State<EditorModel>;

  private $editor!: HTMLDivElement;
  private $editorBlocksContainer!: HTMLDivElement;

  constructor(editorModelState: State<EditorModel>) {
    super(html, css);
    this.editorModelState = editorModelState;
  }

  get htmlTagName(): string {
    return "note-editor";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListeners();
  }

  private $initHtml(): void {
    this.$editor = this.select(".editor")!;
    this.$editorBlocksContainer = this.select(".editor-blocks-container")!;

    this.editorModelState.value.blockContents.forEach((_, index) => {
      const blockContentState = this.editorModelState.createSubState(
        `value.blockContents.${index}`
      );
      this.$editorBlocksContainer.appendChild(
        new EditorBlock(blockContentState)
      );
    });
  }

  private initListeners(): void {
    // close all editor inputs when clicking anywhere inside the editor
    // -> events on input fields are caught by the editor blocks
    this.$editor.addEventListener("click", () => {
      EventBus.notifyAll(CLOSE_ALL_EDITOR_INPUTS_EVENT, {});
    });
  }
}