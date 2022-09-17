import WebComponent from "../../../lib/components/WebComponent";
import html from "./InputTypeConfigurator.html";
import State from "../../../lib/state/State";
import InputTypeConfiguratorItem from "./InputTypeConfiguratorItem/InputTypeConfiguratorItem";
import { TemplateItem } from "../../../data/models/UserSettingsModel";

/**
 * @class InputTypeConfigurator
 * Component to configure the input types of the template
 */
export default class InputTypeConfigurator extends WebComponent {
  static readonly NEXT_BUTTON_CLICKED_EVENT = "finishInputTypeConfiguration";
  static readonly BACK_BUTTON_CLICKED_EVENT = "cancelInputTypeConfiguration";

  private readonly selectedTemplateItems: State<Array<TemplateItem>>;

  private $inputTypeConfigurationElementsContainer!: HTMLDivElement;
  private $backButton!: HTMLButtonElement;
  private $nextButton!: HTMLButtonElement;

  /**
   * Creates a new InputTypeConfigurator
   * @param selectedTemplateItems The state of the selected template items
   */
  constructor(selectedTemplateItems: State<Array<TemplateItem>>) {
    super(html);
    this.selectedTemplateItems = selectedTemplateItems;
  }

  get htmlTagName(): string {
    return "input-type-configurator";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListeners();
  }

  private $initHtml(): void {
    this.$inputTypeConfigurationElementsContainer = this.select(
      "#input-type-configurator-items-container"
    )!;
    this.$backButton = this.select("#input-type-configurator-back-button")!;
    this.$nextButton = this.select("#input-type-configurator-next-button")!;
    this.$appendInputTypeConfigurations();
  }

  private initListeners(): void {
    this.$backButton.addEventListener("click", () => {
      this.notifyAll(InputTypeConfigurator.BACK_BUTTON_CLICKED_EVENT);
    });
    this.$nextButton.addEventListener("click", () => {
      this.notifyAll(InputTypeConfigurator.NEXT_BUTTON_CLICKED_EVENT);
    });
  }

  private $appendInputTypeConfigurations(): void {
    this.selectedTemplateItems.value.forEach((item) => {
      const inputTypeConfiguration = new InputTypeConfiguratorItem(item);
      this.$inputTypeConfigurationElementsContainer.appendChild(
        inputTypeConfiguration
      );
    });
  }

  public refresh(): void {
    this.$inputTypeConfigurationElementsContainer.innerHTML = "";
    this.$appendInputTypeConfigurations();
  }
}
