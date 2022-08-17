import WebComponent from "../../../lib/components/WebComponent";
import html from "./Editor.html";
import EditorBlock from "../EditorBlock/EditorBlock";
import State from "../../../lib/state/State";
import EditorModel from "../../../data/models/EditorModel";

export default class Editor extends WebComponent {
  editorModelState: State<EditorModel>;

  $editorBlocksContainer!: HTMLDivElement;

  constructor(editorModelState: State<EditorModel>) {
    super(html);
    this.editorModelState = editorModelState;
  }

  get htmlTagName(): string {
    return "note-editor";
  }

  onCreate(): void {
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
}
