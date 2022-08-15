import { Observable } from "../events/Observable";

// ====================================================== //
// ====================== State ====================== //
// ====================================================== //

// Wrapper class to make any object/primitive observable

// Usage:
// 1. create a new State object: new State(data)
// 2. to listen for changes, call addEventListener(State.STATE_CHANGE_EVENT, callback) on the State object
// 3. to get the value of the State object, call exampleState.value
// 4. to set the value of the State object, call exampleState.value = newValue

// Example:
// import { State } from "./State";
// let exampleState = new State("some data");
// exampleState.addEventListener(State.STATE_CHANGE_EVENT, (data) => {...}) // listen for State.STATE_CHANGE_EVENT events
// log(exampleState.value) // get the value of the State object and print it (-> "some data")
// exampleState.value = "new data" // set the value of the State object (-> automatically notifies all listeners)

export default class State<T> extends Observable {
  static STATE_CHANGE_EVENT = "change";
  private val!: T;

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
        ? this.createProxy(_value as Record<string, unknown>)
        : _value;
  }

  private createProxy(value: Record<string, unknown>): T {
    return new Proxy(value, this.proxyHandler) as T;
  }

  private proxyHandler = {
    set: (object: any, key: string | symbol, value: any) => {
      if (object[key] !== value) {
        object[key] = value;
        this.notifyAll(State.STATE_CHANGE_EVENT, value);
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

      const prop = object[key];
      if (typeof prop === "undefined") {
        return undefined;
      } else if (!prop.isProxy) {
        if (typeof prop === "object") {
          return this.createProxy(prop);
        }
      }

      return prop;
    },
  };

  get value(): T {
    return this.val;
  }

  set value(value: T) {
    this.setValue(value);
    this.notifyAll(State.STATE_CHANGE_EVENT, this.val);
  }

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
}
