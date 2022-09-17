/**
 * The event data that is passed when all editor inputs should be closed
 */
export interface CloseAllEditorInputsData {
  /**
   * The id of the {@link WebComponent} that triggered the event
   */
  triggerWebComponentId: number;
}

/**
 * The event that is fired when all editor inputs should be closed
 */
export const CLOSE_ALL_EDITOR_INPUTS_EVENT = "close-all-editor-inputs";
