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
import GlobalState from "../../../lib/state/GlobalState";
import { GlobalStates } from "../../../state/GlobalStates";
import { log } from "../../../lib/utils/Logger";

/**
 * @class Editor
 * HTML element that serves as the main editor component
 */
export default class Editor extends WebComponent {
  private editorModelState!: State<EditorModel>;

  private $editor!: HTMLDivElement;
  private $editorBlocksContainer!: HTMLDivElement;
  private $editTemplateIcon!: HTMLDivElement;

  public static EDIT_TEMPLATE_CLICKED_EVENT = "edit-template-clicked";

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

    this.$editTemplateIcon = this.select("#edit-template-icon")!;
  }

  private $toggleLoading(isLoading: boolean): void {
    log(isLoading);
    // todo maybe: loading animation
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

    this.$editTemplateIcon.addEventListener("click", () =>
      this.$onEditTemplateClicked()
    );

    // the editor model changed
    this.editorModelState.addEventListener("change", (event: AppEvent) => {
      const data: StateChangedData = event.data;
      if (data.currentPath === "") {
        // the whole editor model was replaced (e.g. when changing the date)
        // -> remove all editor blocks and append new ones
        this.$editorBlocksContainer
          .querySelectorAll("editor-block")
          .forEach((block) => {
            block.remove();
          });
        this.$appendEditorBlocks();
      } else if (data.property === "inputValue") {
        // the input value of a block changed
        // -> update database
        DataManager.updateEditorModel(this.editorModelState.value);
      }
    });

    EventBus.addEventListener(
      CalendarDay.CALENDAR_DAY_CLICKED_EVENT,
      (event: AppEvent) => {
        // a calendar day was clicked
        const newDate = event.data;
        this.$toggleLoading(true);
        DataManager.getEditorModel(newDate).then((editorModel) => {
          this.editorModelState.value = editorModel;
        });
      }
    );
  }

  private $onEditTemplateClicked = () => {
    EventBus.notifyAll(Editor.EDIT_TEMPLATE_CLICKED_EVENT, {});
  };
}
