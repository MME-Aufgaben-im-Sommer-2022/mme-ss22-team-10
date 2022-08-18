import { Observable } from "../events/Observable";
import {
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

  id = ""; // unique id that identifies any state
  private static stateCounts: Map<string, number> = new Map<string, number>();

  constructor(value: T) {
    super();
    this.generateId();
    this.setValue(value);
  }

  private getTopState(): State<unknown> {
    let topState = this.parentState;
    while (topState && topState.parentState !== null) {
      topState = topState.parentState;
    }
    return topState ? topState : this;
  }

  private setValue(_value: T): void {
    const topState = this.getTopState(),
      proxyMaker = topState ? topState.createProxy : this.createProxy;
    this.val =
      typeof _value === "object"
        ? proxyMaker(_value as Record<string, unknown>, "value")
        : _value;
  }

  private createProxy = (
    value: Record<string, unknown>,
    parentPropertyName: string
  ): T => {
    {
      return new Proxy(value, this.proxyHandler(parentPropertyName)) as T;
    }
  };

  private proxyHandler = (p: string) => {
    return {
      set: (object: any, key: string | symbol, value: any) => {
        const wasTriggeredBySubState =
            typeof key === "string" ? key.split("___").length > 1 : false,
          triggerStateId = wasTriggeredBySubState
            ? key.split("___")[0]
            : this.id,
          realKey = wasTriggeredBySubState
            ? (key as string).split("___")[1]
            : key;

        const oldValue = object[realKey];
        if (oldValue !== value) {
          object[realKey] = value;

          this.onChange({
            oldPropertyValue: oldValue,
            newPropertyValue: object[realKey],
            propertyName: p + "." + realKey.toString(),
            wasTriggeredBySubState: wasTriggeredBySubState,
            triggerStateId: triggerStateId,
            respondents: [triggerStateId],
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
        } else if (!prop["isProxy"]) {
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
        triggerStateId: this.id,
        respondents: [this.id],
      });
      // this.parentState?.updateParentValue(
      //   this.propNameInParentState!,
      //   this.val
      // );
    }
  }

  private onChange = (data: StateChangedEventData) => {
    this.notifyAll(STATE_CHANGE_EVENT, data);
  };

  private generateId = () => {
    const name = this.constructor.name;
    let count = State.stateCounts.get(name);
    if (count === undefined) {
      count = 0;
    }
    State.stateCounts.set(name, count + 1);
    this.id = name + "-" + count;
    Object.freeze(this.id);
  };

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

    const updateSubState = (event) => {
        const data = event.data as StateChangedEventData,
          isPropertyOfSubState = data.propertyName.startsWith(key),
          propertyKeys = data.propertyName.split("."),
          relativeKeys = [
            propertyKeys[0],
            ...propertyKeys.slice(subStateKeys.length, propertyKeys.length),
          ].join("."),
          subStateEventData = Object.assign({}, data, {
            propertyName: relativeKeys,
          });

        if (
          isPropertyOfSubState &&
          (!data.respondents.includes(this.id) ||
            data.triggerStateId === this.id)
        ) {
          if (data.wasTriggeredBySubState) {
            if (data.triggerStateId !== this.id) {
              // now we notify the substate
              subStateEventData.respondents.push(this.id);
              subState.notifyAll(STATE_CHANGE_EVENT, subStateEventData);
            }
          } else {
            // now we notify the substate
            subStateEventData.respondents.push(this.id);
            subState.notifyAll(STATE_CHANGE_EVENT, subStateEventData);
          }
        }
      },
      onSubStateChanged = (event) => {
        // the sub state changed, we need to do some updates
        //log("sub state changed", event.data, this.id);
        const data = event.data as StateChangedEventData;
        //log("sub state changed", data, this.id);
        if (
          data.propertyName === "value" &&
          !data.respondents.includes(this.id)
        ) {
          if (typeof data.oldPropertyValue !== "object") {
            this.updateTopState(key, data);
          } else {
            //log("notifying all");
            this.getTopState().notifyAll(STATE_CHANGE_EVENT, data);
          }
        }
      };
    this.addEventListener(STATE_CHANGE_EVENT, updateSubState);
    subState.addEventListener(STATE_CHANGE_EVENT, onSubStateChanged);

    return subState;
  };

  private updateTopState(propertyName: string, data: StateChangedEventData) {
    let oldValue = undefined;
    const props = propertyName.split(".");
    props.shift();
    try {
      props.reduce((obj, prop, index) => {
        if (index === props.length - 1) {
          oldValue = obj[prop];
          // set the value without triggering the
          obj[data.triggerStateId + "___" + prop] = data.newPropertyValue;
        }
        return obj[prop];
      }, this.val);
    } catch (e) {
      throw new ChangedParentStateError(propertyName, this, data);
    }
  }

  private setParentState(state: State<unknown> | null, propName: string) {
    this.parentState = state;
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
