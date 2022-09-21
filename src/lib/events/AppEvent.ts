// ====================================================== //
// ======================== AppEvent ==================== //
// ====================================================== //

// Modified JS-Class by Alexander Bazo

/**
 * @class AppEvent
 * @description An application internal event
 */
export class AppEvent {
  type: string;
  data: any;

  /**
   * Creates an instance of AppEvent.
   * @param type The type of the event
   * @param data The data of the event
   */
  constructor(type: string, data: any) {
    this.type = type; // event type
    this.data = data; // extra data (e.g. click event data)
    Object.freeze(this);
  }
}
