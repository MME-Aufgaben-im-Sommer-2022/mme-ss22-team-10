import { AppEvent } from "./AppEvent";

// ====================================================== //
// ===================== Observable ===================== //
// ====================================================== //

// JS-Class by Alexander Bazo (modified)

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/Observable.md

export abstract class Observable {
  listener: any = {};

  addEventListener(type: string, callback: (event: AppEvent) => void) {
    if (this.listener[type] === undefined) {
      this.listener[type] = [];
    }
    this.listener[type].push(callback);
  }

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

  notifyAll(type: string, data: any) {
    const event = new AppEvent(type, data);
    if (this.listener[event.type] !== undefined) {
      for (let i = 0; i < this.listener[event.type].length; i++) {
        this.listener[event.type][i](event);
      }
    }
  }

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

  clear() {
    this.listener = {};
  }
}
