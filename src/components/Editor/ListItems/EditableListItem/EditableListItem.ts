import WebComponent from "../../../../lib/components/WebComponent";
import html from "./EditableListItem.html";
import EventBus from "../../../../lib/events/EventBus";
import { AppEvent } from "../../../../lib/events/AppEvent";
import {
  CLOSE_ALL_EDITOR_INPUTS_EVENT,
  CloseAllEditorInputsEventData,
} from "../../../../events/dataTypes/CloseAllEditorInputsEventData";
import State from "../../../../lib/state/State";
import { info, log, trace } from "../../../../lib/utils/Logger";

export default class EditableListItem extends WebComponent {
  $textPreview!: HTMLSpanElement;
  $textInput!: HTMLInputElement;

  private textValueState: State<string>;

  constructor(textValueState: State<string>) {
    super(html);
    this.textValueState = textValueState;
  }

  get htmlTagName(): string {
    return "editable-list-item";
  }

  onCreate(): void {
    this.$initHtml();
    this.$initListeners();
  }

  private $initHtml(): void {
    this.$textPreview = this.select(".text-preview")!;
    this.$textInput = this.select(".text-input")!;
    this.$textPreview.innerText = this.textValueState.value;
    this.$textInput.value = this.textValueState.value;
    this.toggleMode(true);
  }

  private $initListeners(): void {
    this.$textPreview.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggleMode(false);
    });
    this.$textInput.addEventListener("click", (event) => {
      event.stopPropagation(); // catch click event so it doesn't propagate to Editor
    });

    this.textValueState.addEventListener("change", (event) => {
      log("EditableListItem textValueState", event.data);
    });
    // Toggle mode when global event is received
    EventBus.addEventListener(
      CLOSE_ALL_EDITOR_INPUTS_EVENT,
      (event: AppEvent) => this.$onCloseAllEditorInputFields(event.data)
    );
  }

  private $onCloseAllEditorInputFields = (
    data: CloseAllEditorInputsEventData
  ) => {
    if (data.triggerWebComponentId !== this.getWebComponentId()) {
      if (this.$textPreview.hidden) {
        this.toggleMode(true);
      }
    }
  };

  private toggleMode = (doShowTextPreview: boolean) => {
    this.$textPreview.hidden = !doShowTextPreview;
    this.$textInput.hidden = doShowTextPreview;

    if (doShowTextPreview) {
      this.showTextPreview();
    } else {
      this.showTextInput();
    }
  };

  private showTextPreview = () => {
    this.textValueState.value = this.$textInput.value;
    this.$textPreview.innerText = this.textValueState.value;
  };

  private showTextInput = () => {
    this.$textInput.value = this.textValueState.value;
    EventBus.notifyAll(CLOSE_ALL_EDITOR_INPUTS_EVENT, {
      triggerWebComponentId: this.getWebComponentId(),
    });
  };
}
