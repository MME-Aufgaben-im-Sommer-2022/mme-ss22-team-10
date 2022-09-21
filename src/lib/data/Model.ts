import State from "../state/State";

// ====================================================== //
// ======================== Model ======================= //
// ====================================================== //

/**
 * A model is a basic data structure that can be used to store data.
 * **NOTE**: Use State to make observe/manipulate Models. Don't use Models directly.
 *
 * @example
 * For an example, see {@link ExampleModel}
 */
export default abstract class Model {
  private state: State<this> | undefined;

  /**
   * Get the Model as a {@link State} Object
   */
  toState(): State<this> {
    if (!this.state) {
      this.state = new State(this);
    }
    return this.state;
  }
}
