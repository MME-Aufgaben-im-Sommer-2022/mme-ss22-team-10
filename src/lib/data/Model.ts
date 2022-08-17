import State from "../state/State";

// ====================================================== //
// ======================== Model ======================= //
// ====================================================== //

// A model is a basic data structure that can be used to store data.

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/Model.md

export default abstract class Model {
  private state: State<this> | undefined;

  toState(): State<this> {
    if (!this.state) {
      this.state = new State(this);
    }
    return this.state;
  }
}
