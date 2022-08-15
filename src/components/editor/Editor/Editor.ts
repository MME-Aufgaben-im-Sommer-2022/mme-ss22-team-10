import WebComponent from "../../../lib/components/WebComponent";
import html from "./Editor.html";
import EditorBlock, { BlockContent } from "../EditorBlock/EditorBlock";
import State from "../../../lib/state/State";
import { Event } from "../../../lib/events/Event";
import { log } from "../../../lib/utils/Logger";

export interface EditorModel {
  day: Date;
  blockContents: BlockContent[];
}

export default class Editor extends WebComponent {
  editorModelState: State<EditorModel>;

  constructor(editorModel: State<EditorModel>) {
    super(html);
    this.editorModelState = editorModel;
  }

  get htmlTagName(): string {
    return "note-editor";
  }

  onCreate(): void {
    this.editorModelState.addEventListener("change", (event: Event) => {
      log("Editor model changed", event.data);
    });

    const editorBlocksContainer: HTMLDivElement = this.select(
      ".editor-blocks-container"
    )!;
    this.editorModelState.value.blockContents.forEach((blockContent) => {
      editorBlocksContainer.appendChild(new EditorBlock(blockContent));
    });
  }
}
