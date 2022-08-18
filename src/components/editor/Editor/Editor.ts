import WebComponent from "../../../lib/components/WebComponent";
import html from "./Editor.html";
import EditorBlock from "../EditorBlock/EditorBlock";
import State from "../../../lib/state/State";
import EditorModel from "../../../data/models/EditorModel";
import EventBus from "../../../lib/events/EventBus";
import { CLOSE_ALL_EDITOR_INPUTS_EVENT } from "../../../events/dataTypes/CloseAllEditorInputsEventData";

export default class Editor extends WebComponent {
  editorModelState: State<EditorModel>;

  $editor!: HTMLDivElement;
  $editorBlocksContainer!: HTMLDivElement;

  constructor(editorModelState: State<EditorModel>) {
    super(html);
    this.editorModelState = editorModelState;
  }

  get htmlTagName(): string {
    return "note-editor";
  }

  onCreate(): void {
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
    this.$editor.addEventListener("click", () => {
      EventBus.notifyAll(CLOSE_ALL_EDITOR_INPUTS_EVENT, {});
    });
  }
}
