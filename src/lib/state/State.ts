import { Observable } from "../events/Observable";
import {
  CHILD_CHANGE_EVENT,
  STATE_CHANGE_EVENT,
  StateChangedEventData,
} from "../../events/dataTypes/StateChangedEventData";
import { log } from "../utils/Logger";

// ====================================================== //
// ====================== State ====================== //
// ====================================================== //

// Wrapper class to make any object/primitive observable

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/State.md

export default class State<T> extends Observable {
  private val!: T;
  private parentState: State<unknown> | null = null;
  private propNameInParentState: string | null = null;

  id = ""; // unique id that identifies any state
  private static stateCounts: Map<string, number> = new Map<string, number>();

  constructor(value: T) {
    super();
    this.generateId();
    this.setValue(value);
  }

  private setValue(_value: T): void {
    this.val =
      typeof _value === "object"
        ? this.createProxy(_value as Record<string, unknown>, "value")
        : _value;
  }

  private createProxy(
    value: Record<string, unknown>,
    parentPropertyName: string
  ): T {
    return new Proxy(value, this.proxyHandler(parentPropertyName)) as T;
  }

  private proxyHandler = (p: string) => {
    return {
      set: (object: any, key: string | symbol, value: any) => {
        const wasTriggeredBySubState =
            typeof key === "string" ? key.split("___")[0] === "cu" : false,
          realKey = wasTriggeredBySubState
            ? (key as string).split("___")[1]
            : key;

        if (object[realKey] !== value) {
          const oldValue = object[realKey];
          object[realKey] = value;

          this.onChange({
            oldPropertyValue: oldValue,
            newPropertyValue: object[realKey],
            propertyName: p + "." + realKey.toString(),
            wasTriggeredBySubState: wasTriggeredBySubState,
          });
        }

        return true;
      },

      // return new proxy for nested objects
      // to avoid creating new proxies for already proxied objects, the following code was adopted from:
      // https://stackoverflow.com/questions/41299642/how-to-use-javascript-proxy-for-nested-objects
      get: (object: any, key: string | symbol) => {
        if (key === "isProxy") {
          return true;
        }

        if (key === "toJSON") {
          return () => {
            return object;
          };
        }

        const prop = object[key];
        if (typeof prop === "undefined") {
          return undefined;
        } else if (!prop.isProxy) {
          if (typeof prop === "object") {
            return this.createProxy(prop, p + "." + key.toString());
          }
        }

        return prop;
      },
    };
  };

  get value(): T {
    return this.val;
  }

  set value(value: T) {
    if (this.val !== value) {
      const oldValue = this.val;
      this.setValue(value);
      this.onChange({
        oldPropertyValue: oldValue,
        newPropertyValue: this.val,
        propertyName: "value",
        wasTriggeredBySubState: false,
      });
      this.parentState?.updateParentValue(
        this.propNameInParentState!,
        this.val
      );
    }
  }

  private updateParentValue(propertyName: string, value: any) {
    const props = propertyName.split(".");
    props.shift();
    let oldValue = undefined;
    props.reduce((obj, prop, index) => {
      if (index === props.length - 1) {
        oldValue = obj[prop];
        // set the value without triggering the
        obj["cu___" + prop] = value;
      }
      return obj[prop];
    }, this.val);
  }

  private onChange = (data: StateChangedEventData) => {
    this.notifyAll(STATE_CHANGE_EVENT, data);
  };

  private onChildChange = (data: StateChangedEventData) => {
    this.notifyAll(CHILD_CHANGE_EVENT, data);
  };

  private generateId() {
    const name = this.constructor.name;
    let count = State.stateCounts.get(name);
    if (count === undefined) {
      count = 0;
    }
    State.stateCounts.set(name, count + 1);
    this.id = name + "-" + count;
    Object.freeze(this.id);
  }

  // creates a new state from a property of this state.
  // use this, if you want to create a new state from an existing state.
  // e.g. exampleState.createSubState("value.someProperty") will create a new state from the value of the exampleState.value.someProperty property.
  createSubState = (key: string): State<any> => {
    const subStateKeys = key.split("."),
      subStateValue: any = subStateKeys.reduce((obj: any, key: string) => {
        const val = obj[key];
        if (val !== undefined) {
          return val;
        }
        throw new InvalidStateKeyError(key, this);
      }, this),
      subState = new State(subStateValue);

    subState.setParentState(this, key);

    const onStateChange = (event) => {
      const data = event.data as StateChangedEventData,
        isPropertyOfSubState = data.propertyName.startsWith(key);

      if (
        isPropertyOfSubState &&
        !data.wasTriggeredBySubState &&
        !(data.propertyName === key && key === "value")
      ) {
        const propertyKeys = data.propertyName.split("."),
          relativeKeys = [
            propertyKeys[0],
            ...propertyKeys.slice(subStateKeys.length, propertyKeys.length),
          ].join("."),
          subStateEventData = Object.assign({}, data, {
            propertyName: relativeKeys,
          });
        subState.notifyAll(STATE_CHANGE_EVENT, subStateEventData);
      }
    };

    this.addEventListener(STATE_CHANGE_EVENT, onStateChange);
    return subState;
  };

  private setParentState(state: State<unknown> | null, propName: string) {
    this.parentState = state;
    this.propNameInParentState = propName;
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
