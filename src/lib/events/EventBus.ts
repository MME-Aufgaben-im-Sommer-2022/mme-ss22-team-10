import { Observable } from "./Observable";

// ====================================================== //
// ====================== EventBus ====================== //
// ====================================================== //

// Singleton for sending and receiving events globally

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/EventBus.md

class EventBus extends Observable {
  constructor() {
    super();
  }
}

export default new EventBus();
