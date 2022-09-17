import State from "./State";

// ====================================================== //
// ===================== GlobalState ===================== //
// ====================================================== //

/**
 * GlobalState is a singleton that should be used to store states,
 * which are being shared by the entire application
 *
 * @example
 * 1. import the `GlobalState` singleton
 * 2. use `GlobalState.addModel(model)` to add a model to the store
 * 3. use GlobalState.findModel(), GlobalState.findModels() and GlobalState.getModelById() retrieve models from the store
 * 4. (don't forget to call GlobalState.init() at the start of the application)
 */
export default class GlobalState {
  private static states: Map<string, State<any>> = new Map<
    string,
    State<any>
  >();

  /**
   * This function is used to initialize all states.
   * It should be called at the start of the application.
   */
  public static async init() {
    // initial stuff here
  }

  /**
   * Adds a state to the store.
   * @param state The state to add
   * @param id The id of the state
   *
   * @example
   * GlobalState.addState(new State("hi there"));
   */
  public static addState(state: State<any>, id?: string): void {
    this.states.set(id ?? state.id.toString(), state);
  }

  /**
   * Returns a state from the store by its id.
   * @param id The id of the state
   */
  public static getStateById<T>(id: string): State<T> | undefined {
    return this.states.get(id) as State<T>;
  }

  /**
   * Returns a state from the store, that matches the given predicate.
   * @param predicate The predicate to match
   * @param classConstructor The class constructor of the state
   *
   * @example
   * GlobalState.findState(state => state.name === "John", ExampleModel)
   */
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

  /**
   * Whether the store contains a state with the given id.
   * @param id The id of the state
   */
  public static hasState(id: string): boolean {
    return this.states.has(id);
  }

  /**
   * Returns all states from the store, that match the given predicate.
   * @param predicate The predicate to match
   * @param classConstructor The class constructor of the state
   */
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
