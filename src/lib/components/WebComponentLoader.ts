import WebComponent from "./WebComponent";

// ====================================================== //
// ================= WebComponentLoader ================= //
// ====================================================== //

/**
 * This class is used to load all custom web components (otherwise they won't work).
 *
 * @example
 * - Call WebComponentLoader.loadComponents().then(() => {...}) at the start of the application
 */
export default class WebComponentLoader {
  /**
   * All component definitions
   * @private
   */
  private static componentDefinitions: ComponentDefinition<WebComponent>[] = [];

  /**
   * Loads all custom web component definitions
   */
  public static async loadAll(): Promise<void> {
    const modules: GlobImport = import.meta.importGlob(
        "../../components/**/*.ts"
      ),
      modulePaths = Object.keys(modules);
    for (const modulePath of modulePaths) {
      const module = await modules[modulePath](),
        componentClass = module.default;
      if (componentClass && componentClass.prototype.htmlTagName) {
        const componentDefinition = new ComponentDefinition(
          componentClass.prototype.htmlTagName,
          componentClass
        );
        WebComponentLoader.addComponentDefinition(componentDefinition);
      }
    }
    WebComponentLoader.defineAll();
  }

  /**
   * Adds a new component definition
   * @param componentDefinition The component definition to add
   * @private
   */
  private static addComponentDefinition(
    componentDefinition: ComponentDefinition<WebComponent>
  ): void {
    this.componentDefinitions.push(componentDefinition);
  }

  /**
   * Defines all components
   * @private
   */
  private static defineAll(): void {
    this.componentDefinitions.forEach((componentDefinition) =>
      componentDefinition.defineSelf()
    );
  }
}

/**
 * A component definition, which can be executed to define a custom web component
 */
class ComponentDefinition<T extends WebComponent> {
  /**
   * The name of the component
   */
  name: string;

  /**
   * The constructor of the component
   */
  componentConstructor: new () => T;

  /**
   * Creates a new component definition
   * @param name The name of the component
   * @param componentConstructor The constructor of the component
   */
  constructor(name: string, componentConstructor: new () => T) {
    this.name = name;
    this.componentConstructor = componentConstructor;
  }

  /**
   * Defines the component
   */
  public defineSelf(): void {
    customElements.define(this.name, this.componentConstructor);
  }
}

/**
 * A helper type for the return value of the import.meta.importGlob() function
 */
type GlobImport = {
  [key: string]: () => Promise<any>;
};
