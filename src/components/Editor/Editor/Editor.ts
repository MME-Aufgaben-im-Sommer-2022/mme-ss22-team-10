import WebComponent from "../../../lib/components/WebComponent";
import html from "./Editor.html";
import EditorBlock from "../EditorBlock/EditorBlock";
import State from "../../../lib/state/State";
import EditorModel from "../../../data/models/EditorModel";
import EventBus from "../../../lib/events/EventBus";
import css from "./Editor.css";
import { CLOSE_ALL_EDITOR_INPUTS_EVENT } from "../../../events/CloseAllEditorInputs";
import CalendarDay from "../../Calendar/CalendarDay/CalendarDay";
import { AppEvent } from "../../../lib/events/AppEvent";
import DataManager from "../../../data/DataManager";
import { StateChangedData } from "../../../events/StateChanged";
import { parseDateFromString } from "../../../lib/utils";
import GlobalState from "../../../lib/state/GlobalState";
import { GlobalStates } from "../../../state/GlobalStates";

// HTML element that serves as the main editor component

// Necessary constructor parameters:
// - editorModelState:
//    - a state object that holds the editor model

export default class Editor extends WebComponent {
  private editorModelState!: State<EditorModel>;

  private $editor!: HTMLDivElement;
  private $editorBlocksContainer!: HTMLDivElement;

  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
    return "note-editor";
  }

  onCreate(): Promise<void> | void {
    this.$toggleLoading(true);
    return this.initData().then(() => {
      this.$initHtml();
      this.initListeners();
    });
  }

  private async initData() {
    if (!GlobalState.hasState(GlobalStates.editorModel)) {
      const editorModel = await DataManager.getEditorModel(new Date());
      if (editorModel) {
        GlobalState.addState(editorModel.toState(), GlobalStates.editorModel);
      } else {
        throw new Error("Could not load editor model");
      }
    }
    this.editorModelState = GlobalState.getStateById<EditorModel>(
      GlobalStates.editorModel
    )!;
  }

  private $initHtml(): void {
    this.$editor = this.select(".editor")!;
    this.$editorBlocksContainer = this.select(".editor-blocks-container")!;
    this.$appendEditorBlocks();
  }

  private $toggleLoading(isLoading: boolean): void {
    //
  }

  private $appendEditorBlocks(): void {
    this.editorModelState.value.blockContents.forEach((_, index) => {
      const blockContentState = this.editorModelState.createSubState(
        `value.blockContents.${index}`
      );
      this.$editorBlocksContainer.insertBefore(
        new EditorBlock(blockContentState),
        this.select(".spacer")!
      );
    });
    this.$toggleLoading(false);
  }

  private initListeners(): void {
    // close all editor inputs when clicking anywhere inside the editor
    // -> events on input fields are caught by the editor blocks
    this.$editor.addEventListener("click", () => {
      EventBus.notifyAll(CLOSE_ALL_EDITOR_INPUTS_EVENT, {});
    });

    this.editorModelState.addEventListener("change", (event: AppEvent) => {
      const data: StateChangedData = event.data;
      if (data.currentPath === "") {
        this.$editorBlocksContainer
          .querySelectorAll("editor-block")
          .forEach((block) => {
            block.remove();
          });
        this.$appendEditorBlocks();
      } else {
        DataManager.updateEditorModel(this.editorModelState.value);
      }
    });

    EventBus.addEventListener(
      CalendarDay.CALENDAR_DAY_CLICKED_EVENT,
      (event: AppEvent) => {
        const newDate = event.data;
        this.$toggleLoading(true);
        DataManager.getEditorModel(parseDateFromString(newDate)).then(
          (editorModel) => {
            this.editorModelState.value = editorModel;
          }
        );
      }
    );
  }
}
