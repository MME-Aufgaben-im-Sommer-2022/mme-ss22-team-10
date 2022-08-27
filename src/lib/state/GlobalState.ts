import State from "./State";

// ====================================================== //
// ===================== GlobalState ===================== //
// ====================================================== //

// GlobalState is a singleton that should be used to store states,
// which are being shared by the entire application

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/GlobalState.md

export default class GlobalState {
  private static states: Map<string, State<any>> = new Map<
    string,
    State<any>
  >();

  // This function is used to initialize all states.
  // It should be called at the start of the application.
  public static async init() {
    // initial stuff here
  }

  // Adds a state to the store.
  public static addState(state: State<any>, id?: string): void {
    this.states.set(id ?? state.id.toString(), state);
  }

  // Returns a state from the store by its id.
  public static getStateById<T>(id: string): State<T> | undefined {
    return this.states.get(id) as State<T>;
  }

  // Returns a state from the store, that matches the given predicate.
  // Example: GlobalState.findModel(state => state.name === "John", ExampleModel)
  public static findState<T>(
    predicate: (value: T) => boolean,
    classConstructor: new (...args: any[]) => T
  ): State<T> | undefined {
    for (const state of this.states.values()) {
      if (state.value instanceof classConstructor && predicate(state.value)) {
        return state as State<T>;
      }
    }
    return undefined;
  }

  // Returns all states from the store, that match the given predicate.
  // -> Like GlobalState.findModel(), but returns all matches.
  public static findStates<T>(
    predicate: (value: T) => boolean,
    classConstructor: new (...args: any[]) => T
  ): State<T>[] {
    const states: State<T>[] = [];
    for (const state of this.states.values()) {
      if (state.value instanceof classConstructor && predicate(state.value)) {
        states.push(state as State<T>);
      }
    }
    return states;
  }
}
