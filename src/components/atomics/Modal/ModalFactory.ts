import Modal, { ModalContent } from "./Modal";

/**
 * @class ModalFactory
 * Factory class for creating & displaying {@link Modal} elements.
 */
export default class ModalFactory<T extends ModalContent> {
  private $content?: T;

  private onCloseCallback?: (data: any) => void;
  private onOpenCallback?: (data: any) => void;

  /**
   * Sets the content of the modal.
   * @param $newContent The new content to display in the modal.
   * @returns Current instance of the factory for further chaining.
   */
  public setContent($newContent: T): ModalFactory<T> {
    this.$content = $newContent;
    return this;
  }

  /**
   * Adds a callback that is called when the modal is closed.
   * @param callback Callback to be called when the modal is closed.
   * @returns Current instance of the factory for further chaining.
   */
  public onClose(callback: (data: any) => void): ModalFactory<T> {
    this.onCloseCallback = callback;
    return this;
  }

  /**
   * Adds a callback that is called when the modal is opened.
   * @param callback Callback to be called when the modal is opened.
   * @returns Current instance of the factory for further chaining.
   */
  public onOpen(callback: (data: any) => void): ModalFactory<T> {
    this.onOpenCallback = callback;
    return this;
  }

  /**
   * Build and return the modal.
   * @returns A new modal element, which is already appended to the DOM.
   */
  public build(): Modal<T> {
    const modal: Modal<any> = new Modal(this.$content!);
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
