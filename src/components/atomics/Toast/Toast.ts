/* eslint-disable no-magic-numbers */
import WebComponent from "../../../lib/components/WebComponent";
import css from "./Toast.css";

/**
 * The type of the toast.
 */
export enum ToastType {
  Info = "info",
  Success = "success",
  Warning = "warning",
  Error = "error",
}

/**
 * The duration of the toast.
 */
export enum ToastDuration {
  Short = 2000,
  Medium = 5000,
  Long = 10000,
}

/**
 * @class Toast
 * @extends WebComponent
 * A Toast, which is a small popup that appears at the bottom of the screen to display a message.
 * NOTE: Use {@link ToastFactory} to create a toast.
 */
export default class Toast extends WebComponent {
  private readonly message: string;
  private readonly type: ToastType;
  private readonly duration: number;

  /**
   * Creates a new Toast instance.
   * @param message The message to display.
   * @param type The type of the toast.
   * @param duration The duration of the toast.
   */
  constructor(message: string, type: ToastType, duration: number) {
    super(undefined, css);
    this.message = message;
    this.type = type;
    this.duration = duration;
  }

  get htmlTagName(): string {
    return "custom-toast";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListener();
  }

  $initHtml(): void {
    this.classList.add(this.type);
    this.classList.add("slide-up-in");
    this.innerHTML = this.message;
  }

  private initListener(): void {
    this.addEventListener("click", () => this.$close());
    setTimeout(this.$close, this.duration);
  }

  $close = (): void => {
    this.classList.remove("slide-up-in");
    this.classList.add("slide-down-out");
    setTimeout(() => this.remove(), 300); // 300ms is the duration of the animation
  };
}
