import Toast, { ToastDuration, ToastType } from "./Toast";

/**
 * @class ToastFactory
 * A factory to create a {@link Toast}.
 */
export class ToastFactory {
  private type = ToastType.Info;
  private duration: number = ToastDuration.Short;
  private message = "";

  /**
   * Sets the type of the toast.
   * @param type The type of the toast.
   */
  setType(type: ToastType): ToastFactory {
    this.type = type;
    return this;
  }

  /**
   * Sets the message of the toast.
   * @param message The message of the toast.
   */
  setMessage(message: string): ToastFactory {
    this.message = message;
    return this;
  }

  /**
   * Sets the duration of the toast.
   * @param duration The duration of the toast.
   */
  setDuration(duration: ToastDuration | number): ToastFactory {
    this.duration = duration;
    return this;
  }

  /**
   * Shows the toast in the DOM.
   */
  show(): void {
    const toast = new Toast(this.message, this.type, this.duration);
    document.body.appendChild(toast);
  }
}
