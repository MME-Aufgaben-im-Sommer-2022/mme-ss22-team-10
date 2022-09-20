import { STATE_CHANGE_EVENT } from "../../../events/StateChanged";
import WebComponent from "../../../lib/components/WebComponent";
import State from "../../../lib/state/State";
import css from "./Modal.css";
import html from "./Modal.html";

export interface ModalContentActions {
  onModalClose: () => void;
}

export type ModalContent = WebComponent & ModalContentActions;

export default class Modal<T extends ModalContent> extends WebComponent {
  public static ON_CLOSE_EVENT = "on-close";
  public static ON_OPEN_EVENT = "on-open";

  public static DO_CLOSE_EVENT = "do-close";

  private $contentContainer!: HTMLDivElement;
  private $bg!: HTMLDivElement;
  private $content: T;

  private isOpenState = new State(false);

  constructor($content: T) {
    super(html, css);
    this.$content = $content;
  }

  onCreate(): void | Promise<void> {
    this.$initHtml();
    this.initListener();
  }

  private $initHtml(): void {
    this.hidden = true;
    this.$contentContainer = this.select(".modal-content-container")!;
    this.$bg = this.select(".modal-bg")!;
    this.$contentContainer.append(this.$content);
  }

  private initListener(): void {
    this.$bg.addEventListener("click", () => this.close());
    this.$content.addEventListener(Modal.DO_CLOSE_EVENT, this.close);
    this.isOpenState.addEventListener(
      STATE_CHANGE_EVENT,
      this.onOpenStateChanged
    );
  }

  private onOpenStateChanged = (): void => {
    if (this.isOpen()) {
      this.onOpen();
    } else {
      this.onClose();
    }
  };

  public open() {
    this.isOpenState.value = true;
  }

  private onOpen(): void {
    this.hidden = false;
    this.$contentContainer.hidden = false;
    this.$bg.hidden = false;
    this.notifyAll(Modal.ON_OPEN_EVENT);
  }

  public close = () => {
    this.isOpenState.value = false;
  };

  private onClose = () => {
    this.hidden = true;
    this.$contentContainer.hidden = true;
    this.$bg.hidden = true;
    this.notifyAll(Modal.ON_CLOSE_EVENT);
    this.$content.onModalClose();
  };

  onDestroy(): void {
    this.$content.remove();
  }

  get htmlTagName(): string {
    return "modal-component";
  }

  public setContent = ($newContent: T): void => {
    this.$content.remove();
    this.$content = $newContent;
    this.$content.addEventListener(Modal.DO_CLOSE_EVENT, this.close);
    this.append($newContent);
  };

  isOpen(): boolean {
    return this.isOpenState.value;
  }

  toggle(): void {
    this.isOpenState.value = !this.isOpenState.value;
  }
}
