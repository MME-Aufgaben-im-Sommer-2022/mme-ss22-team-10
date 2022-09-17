// ====================================================== //
// ==================== WebComponent ==================== //
// ====================================================== //

// This class is used to create your custom web components.

// Usage guide & examples:
// https://github.com/MME-Aufgaben-im-Sommer-2022/mme-ss22-team-10/blob/dev/docs/lib/WebComponent.md

/**
 * This class is used to create your custom web components.
 *
 * @example
 * 1. Create a html (and css) file for your component in a new folder
 * 2. Create a new ts class that extends `WebComponent`
 * 3. Use the component either in HTML or in TypeScript:
 *     - in HTML: `<my-component></my-component>`
 *     - in TypeScript: `const myComponent = new MyComponent()`
 * 4. (don't forget to call `WebComponentLoader.loadAll().then(() => {...})` at the start of your application)
 *
 * For code examples, see the [ExampleWebComponent](../../src/components/ExampleComponent/)
 */

export default abstract class WebComponent extends HTMLElement {
  /**
   * Total number of WebComponents created
   * @private
   */
  private static totalWebComponents = 0;

  /**
   * Your custom web component's HTML
   */
  html: string;
  /**
   * Your custom web component's CSS
   */
  css: string;

  /**
   * The ID of this WebComponent
   * @private
   */
  private webComponentId!: number; // unique id for each web component

  /**
   * Creates a new WebComponent
   * @param html The HTML of your custom web component
   * @param css The CSS of your custom web component
   * @protected
   */
  protected constructor(html?: string, css?: string) {
    super();
    this.setId();
    this.html = html ?? "";
    this.css = css ?? "";
  }

  /**
   * Called, when the component is connected to the DOM
   * Override this method in your component to add listeners, set data, etc.
   */
  abstract onCreate(): Promise<void> | void;

  /**
   * Called, when the component is disconnected from the DOM
   */
  onDestroy() {
    // override this method in your component to clean up listeners, etc.
  }

  /**
   * Returns the HTML tag name of the component
   * Example: A component <example-component /> would return "example-component"
   */
  abstract get htmlTagName(): string;

  /**
   * Dispatches an event to all listeners
   * @param eventName The name of the event
   * @param data The data to be sent with the event
   * @protected
   */
  protected notifyAll(eventName: string, data?: any) {
    const event = new CustomEvent(eventName, { detail: data });
    this.dispatchEvent(event);
  }

  /**
   * Returns the first element that matches the specified selector
   * @param selector A CSS selector
   */
  select<E extends HTMLElement>(selector: string): E | null {
    return this.querySelector(selector);
  }

  /**
   * Returns all elements that match the specified selector
   * @param selector A CSS selector
   */
  selectAll<E extends Element = Element>(selector: string): NodeListOf<E> {
    return this.querySelectorAll(selector);
  }

  /**
   * Called, when the component is connected to the DOM
   * Called by the browser
   */
  async connectedCallback() {
    this.loadStylesheet();
    this.loadHtml();
    const create: Promise<void> | void = this.onCreate();
    if (create instanceof Promise) {
      await create;
    }
  }

  /**
   * Called, when the component is disconnected from the DOM
   * Called by the browser
   */
  async disconnectedCallback() {
    this.onDestroy();
  }

  /**
   * Loads the CSS of the component
   * @private
   */
  private loadStylesheet() {
    if (this.css !== "") {
      const style = document.createElement("style");
      style.innerHTML = this.css;
      this.appendChild(style);
    }
  }

  /**
   * Loads the HTML of the component
   * @private
   */
  private loadHtml() {
    if (this.html !== "") {
      const template = document.createElement("template");
      template.innerHTML = this.html;
      this.appendChild(template.content.cloneNode(true));
      this.classList.add("web-component");
    }
  }

  /**
   * Sets the ID of the component
   * @private
   */
  private setId() {
    WebComponent.totalWebComponents++;
    this.webComponentId = WebComponent.totalWebComponents;
    Object.freeze(this.webComponentId);
  }

  /**
   * @returns The ID of the component
   */
  getWebComponentId(): number {
    return this.webComponentId;
  }
}
