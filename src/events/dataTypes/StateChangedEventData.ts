import { ObservableSlimChanges } from "../../lib/state/State";

export interface StateChangedEventData extends ObservableSlimChanges {
  triggerStateId: string; // the state that triggered the change
}

export const STATE_CHANGE_EVENT = "change";
