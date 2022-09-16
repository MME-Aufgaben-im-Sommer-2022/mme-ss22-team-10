import WebComponent from "../../../lib/components/WebComponent";
import css from "./Toast.css";

export enum ToastType {
  Info = "info",
  Success = "success",
  Warning = "warning",
  Error = "error",
}

export enum ToastDuration {
  Short = 3000,
  Medium = 5000,
  Long = 10000,
}

export default class Toast extends WebComponent {
  private readonly message: string;
  private readonly type: ToastType;
  private readonly duration: number;

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
    setTimeout(() => this.remove(), 300);
  };
}
