import { AppEvent } from "./AppEvent";

// ====================================================== //
// ===================== Observable ===================== //
// ====================================================== //

// JS-Class by Alexander Bazo (modified)

/**
 * @class Observable
 * @description An observable object
 * @example
 * Extending `Observable` provides a class with basic pubSub functionality:
 * 1. create a class that extends `Observable`
 * 2. call `.addEventListener` on objects of that class to subscribe to events
 * 3. call `notifyAll` to publish an event to all subscribers
 */
export abstract class Observable {
  listener: any = {};

  /**
   * Adds an event listener
   * @param type The type of the event
   * @param callback The callback function
   */
  addEventListener(type: string, callback: (event: AppEvent) => void) {
    if (this.listener[type] === undefined) {
      this.listener[type] = [];
    }
    this.listener[type].push(callback);
  }

  /**
   * Removes an event listener
   * @param type The type of the event
   * @param callback The callback function
   */
  removeEventListener(type: string, callback: (event: AppEvent) => void) {
    if (this.listener[type] !== undefined) {
      for (let i = 0; i < this.listener[type].length; i++) {
        if (this.listener[type][i] === callback) {
          this.listener[type].splice(i, 1);
          return;
        }
      }
    }
  }

  /**
   * Notifies all subscribers of an event
   * @param type The type of the event
   * @param data The data of the event
   */
  notifyAll(type: string, data: any) {
    const event = new AppEvent(type, data);
    if (this.listener[event.type] !== undefined) {
      for (let i = 0; i < this.listener[event.type].length; i++) {
        this.listener[event.type][i](event);
      }
    }
  }

  /**
   * Notifies all subscribers of an event, except the one provided
   * @param type The type of the event
   * @param data The data of the event
   * @param callback The callback function, which should not be notified
   */
  notifyAllExcept(
    type: string,
    data: any,
    callback: (event: AppEvent) => void
  ) {
    const event = new AppEvent(type, data);
    if (this.listener[event.type] !== undefined) {
      for (let i = 0; i < this.listener[event.type].length; i++) {
        if (this.listener[event.type][i] !== callback) {
          this.listener[event.type][i](event);
        }
      }
    }
  }

  /**
   * Removes all event listeners
   */
  clear() {
    this.listener = {};
  }
}
