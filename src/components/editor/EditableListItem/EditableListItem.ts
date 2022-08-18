import WebComponent from "../../../lib/components/WebComponent";
import html from "./EditableListItem.html";
import EventBus from "../../../lib/events/EventBus";
import { AppEvent } from "../../../lib/events/AppEvent";
import {
  CLOSE_ALL_EDITOR_INPUTS_EVENT,
  CloseAllEditorInputsEventData,
} from "../../../events/dataTypes/CloseAllEditorInputsEventData";
import {
  EDITOR_INPUT_FINISH_EDITING_EVENT,
  EditorInputFinishEditingEventData,
} from "../../../events/dataTypes/EditorInputFinishEditingEventData";

export default class EditableListItem extends WebComponent {
  $textPreview!: HTMLSpanElement;
  $textInput!: HTMLInputElement;

  private textValue: string;

  constructor(textValue: string) {
    super(html);
    this.textValue = textValue;
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
    this.$textPreview.innerText = this.textValue;
    this.$textInput.value = this.textValue;
    this.toggleMode(true);
  }

  private $initListeners(): void {
    this.$textPreview.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggleMode(false);
    });
    this.$textInput.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    this.$textInput.addEventListener("input", this.$onTextInputChanged);
    EventBus.addEventListener(
      CLOSE_ALL_EDITOR_INPUTS_EVENT,
      (event: AppEvent) => this.$onCloseAllEditorInputFields(event.data)
    );
  }

  private $onTextInputChanged = (event: Event) => {
    this.textValue = (event.target as HTMLInputElement).value;
  };

  private $onCloseAllEditorInputFields = (
    data: CloseAllEditorInputsEventData
  ) => {
    if (data.triggerWebComponentId !== this.getWebComponentId()) {
      this.toggleMode(true);
    }
  };

  private toggleMode = (doShowTextPreview: boolean) => {
    this.$textPreview.hidden = !doShowTextPreview;
    this.$textInput.hidden = doShowTextPreview;

    if (doShowTextPreview) {
      this.$onFinishEditing();
    } else {
      this.$onStartEditing();
    }
  };

  private $onStartEditing = () => {
    this.textValue = this.$textInput.value;
    this.$textPreview.innerText = this.textValue;
    EventBus.notifyAll(CLOSE_ALL_EDITOR_INPUTS_EVENT, {
      triggerWebComponentId: this.getWebComponentId(),
    });
  };

  private $onFinishEditing = () => {
    this.$textInput.value = this.textValue;
    this.notifyAll(EDITOR_INPUT_FINISH_EDITING_EVENT, {
      newInputValue: this.textValue,
    } as EditorInputFinishEditingEventData);
  };
}
