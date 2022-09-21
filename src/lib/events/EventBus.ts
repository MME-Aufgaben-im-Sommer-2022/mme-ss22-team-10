import { Observable } from "./Observable";

// ====================================================== //
// ====================== EventBus ====================== //
// ====================================================== //

/**
 * @class EventBus
 * Singleton for sending and receiving events globally
 * @example
 * // listen for "someEvent" events
 * EventBus.addEventListener("someEvent", (data) => {})
 * // send "someEvent" event with data: {some: "data"}
 * EventBus.notifyAll("someEvent", {some: "data"})
 */
class EventBus extends Observable {
  constructor() {
    super();
  }
}

export default new EventBus();
