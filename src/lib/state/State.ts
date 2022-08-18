import { Observable } from "../events/Observable";
import { StateChangedEventData } from "../../events/dataTypes/StateChangedEventData";
import { log } from "../utils/Logger";
import ObservableSlim from "observable-slim";

// ====================================================== //
// ====================== State ====================== //
// ====================================================== //

// Wrapper class to make any object/primitive observable

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/State.md

export default class State<T> extends Observable {
  private val: ProxyConstructor | T;

  constructor(value: T) {
    super();
    log("State", "constructor", "val:", value);
    this.val =
      typeof value === "object"
        ? ObservableSlim.create(value, false, this.onValueChange)
        : value;
  }

  get value(): T {
    return this.val as T;
  }

  set value(val: T) {
    if (typeof val !== "object") {
      this.val = val;
    } else {
      this.val = ObservableSlim.create(val, false, this.onValueChange);
    }
    this.onValueChange({});
  }

  onValueChange = (changes: any) => {
    this.notifyAll("change", changes);
  };

  createSubState(key: string): State<any> {
    const subStateKeys = key.split("."),
      subStateValue: any = subStateKeys.reduce((obj: any, key: string) => {
        const val = obj[key];
        if (val !== undefined) {
          return val;
        }
        throw new InvalidStateKeyError(key, this);
      }, this);
    if (typeof subStateValue === "object") {
      // eslint-disable-next-line no-underscore-dangle
      const subState = new State(subStateValue.__getTarget);
      return subState;
    }
    throw new Error(
      "SubStates of properties that are Primitives are not supported yet."
    );
  }
}

// custom error type for invalid state keys
export class InvalidStateKeyError<T> extends Error {
  private static readonly DOCS_LINK =
    "https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/master/docs/lib.md#state";

  constructor(subStateKey: string, state: State<T>) {
    super();
    this.message = `Key does not exist!
    
    Pro tip: Check the dev docs on how to use the key parameter: ${
      InvalidStateKeyError.DOCS_LINK
    }
    
    Detailed error:
    ${subStateKey} could not be found in "value":${JSON.stringify(state.value)}
    `;
  }
}

export class ChangedParentStateError extends Error {
  constructor(
    propertyName: string,
    state: State<unknown>,
    data: StateChangedEventData
  ) {
    super();
    this.message = `The property "${propertyName}", which is referenced by a SubState cannot be found in the Parent state anymore.
    
    Did you change the value of the parent state using state.value = ... ?
    
    Detailed error:
    Parent state value: "value: ${JSON.stringify(state.value)}"
    Missing property: ${JSON.stringify(propertyName)}
    State change event data: ${JSON.stringify(data)}
    `;
  }
}
