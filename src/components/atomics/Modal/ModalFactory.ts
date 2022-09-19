import Modal, { ModalContent } from "./Modal";

export default class ModalFactory<T extends ModalContent> {
  private $content?: T;

  private onCloseCallback?: (data: any) => void;
  private onOpenCallback?: (data: any) => void;

  public setContent($newContent: T): ModalFactory<T> {
    this.$content = $newContent;
    return this;
  }

  public onClose(callback: (data: any) => void): ModalFactory<T> {
    this.onCloseCallback = callback;
    return this;
  }

  public onOpen(callback: (data: any) => void): ModalFactory<T> {
    this.onOpenCallback = callback;
    return this;
  }

  public build(): Modal<T> {
    const modal = new Modal(this.$content!);
    if (this.onCloseCallback) {
      modal.addEventListener(Modal.ON_CLOSE_EVENT, this.onCloseCallback);
    }

    if (this.onOpenCallback) {
      modal.addEventListener(Modal.ON_OPEN_EVENT, this.onOpenCallback);
    }

    document.querySelector("#app")!.append(modal);
    return modal;
  }
}
