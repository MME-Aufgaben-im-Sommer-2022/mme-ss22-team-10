export interface StateChangedEventData {
  oldPropertyValue?: any; // may be undefined if the property is new
  newPropertyValue?: any; // may be undefined if the property is deleted
  propertyName: string; // equals "value" if the whole state is changed
  wasTriggeredBySubState?: boolean; // true if the change was triggered by a sub state
}

export const STATE_CHANGE_EVENT = "change";
export const CHILD_CHANGE_EVENT = "child-change";
