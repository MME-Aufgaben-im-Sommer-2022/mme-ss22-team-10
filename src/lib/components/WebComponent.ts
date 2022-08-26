// ====================================================== //
// ==================== WebComponent ==================== //
// ====================================================== //

// This class is used to create your custom web components.

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/WebComponent.md

export default abstract class WebComponent extends HTMLElement {
  private static totalWebComponents = 0;

  html: string;
  css: string;

  private webComponentId!: number; // unique id for each web component

  protected constructor(html?: string, css?: string) {
    super();
    this.setId();
    this.html = html ?? "";
    this.css = css ?? "";
  }

  // Called, when the component is connected to the DOM
  // Override this method in your component to add listeners, set data, etc.
  abstract onCreate(): Promise<void> | void;

  onDestroy() {
    // override this method in your component to clean up listeners, etc.
  }

  // Returns the HTML tag name of the component
  // Example: A component <example-component /> would return "example-component"
  abstract get htmlTagName(): string;

  // Wrapper for making dispatchEvent consistent with the Observer pattern
  protected notifyAll(eventName: string, data?: any) {
    const event = new CustomEvent(eventName, { detail: data });
    this.dispatchEvent(event);
  }

  // shortcut for this.root.querySelector(selector)
  select<E extends HTMLElement>(selector: string): E | null {
    return this.querySelector(selector);
  }

  // shortcut for this.root.querySelectorAll(selector)
  selectAll<E extends Element = Element>(selectors: string): NodeListOf<E> {
    return this.querySelectorAll(selectors);
  }

  async connectedCallback() {
    this.loadStylesheet();
    this.loadHtml();
    const create: Promise<void> | void = this.onCreate();
    if (create instanceof Promise) {
      await create;
    }
  }

  async disconnectedCallback() {
    this.onDestroy();
  }

  loadStylesheet() {
    if (this.css !== "") {
      const style = document.createElement("style");
      style.innerHTML = this.css;
      this.appendChild(style);
    }
  }

  loadHtml() {
    if (this.html !== "") {
      const template = document.createElement("template");
      template.innerHTML = this.html;
      this.appendChild(template.content.cloneNode(true));
      this.classList.add("web-component");
    }
  }

  private setId() {
    WebComponent.totalWebComponents++;
    this.webComponentId = WebComponent.totalWebComponents;
    Object.freeze(this.webComponentId);
  }

  getWebComponentId(): number {
    return this.webComponentId;
  }
}
