import { ObservableSlimChanges } from "../lib/state/State";

/**
 * The data that is passed when a state changes
 */
export interface StateChangedData extends ObservableSlimChanges {
  /**
   * The id of the state that changed
   */
  triggerStateId: string;
}

/**
 * The event that is fired when a state changes
 */
export const STATE_CHANGE_EVENT = "change";
