/**
 * The event data that is passed when a user finishes editing an input
 */
export interface EditorInputFinishEditingData {
  /**
   * The new value of the input
   */
  newInputValue: string;
}

/**
 * The event that is fired when the user finishes editing an input
 */
export const EDITOR_INPUT_FINISH_EDITING_EVENT = "editor-input-finish-editing";
