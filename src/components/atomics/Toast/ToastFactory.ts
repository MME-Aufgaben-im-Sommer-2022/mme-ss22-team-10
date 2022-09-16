import Toast, { ToastDuration, ToastType } from "./Toast";

export class ToastFactory {
  private type: ToastType = ToastType.Info;
  private duration: number = ToastDuration.Short;
  private message = "";

  setType(type: ToastType): ToastFactory {
    this.type = type;
    return this;
  }

  setMessage(message: string): ToastFactory {
    this.message = message;
    return this;
  }

  setDuration(duration: ToastDuration | number): ToastFactory {
    this.duration = duration;
    return this;
  }

  show(): void {
    const toast = new Toast(this.message, this.type, this.duration);
    document.body.appendChild(toast);
  }
}
