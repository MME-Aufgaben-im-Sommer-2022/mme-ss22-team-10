import WebComponent from "../../../lib/components/WebComponent";
import html from "./InputTypeConfigurator.html";
import css from "./InputTypeConfigurator.css";
import State from "../../../lib/state/State";
import { BlockContentInputType } from "../../../data/models/EditorModel";
import InputTypeConfiguratorItem from "./InputTypeConfiguratorItem/InputTypeConfiguratorItem";

export default class InputTypeConfigurator extends WebComponent {
  static readonly NEXT_BUTTON_CLICKED_EVENT = "finishInputTypeConfiguration";
  static readonly BACK_BUTTON_CLICKED_EVENT = "cancelInputTypeConfiguration";

  private readonly selectedTitlesState: State<Array<string>>;
  private readonly selectedInputTypesState: State<Array<BlockContentInputType>>;

  private $inputTypeConfigurationElementsContainer!: HTMLDivElement;
  private $backButton!: HTMLButtonElement;
  private $nextButton!: HTMLButtonElement;

  constructor(
    selectedTitlesState: State<Array<string>>,
    selectedInputTypesState: State<Array<BlockContentInputType>>
  ) {
    super(html, css);
    this.selectedTitlesState = selectedTitlesState;
    this.selectedInputTypesState = selectedInputTypesState;
  }

  get htmlTagName(): string {
    return "input-type-configurator";
  }

  onCreate(): void {
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
    this.selectedTitlesState.value.forEach((title, index) => {
      const selectedInputTypeState = new State<BlockContentInputType>(
          BlockContentInputType.FreeText
        ),
        inputTypeConfiguration = new InputTypeConfiguratorItem(
          title,
          selectedInputTypeState
        );
      this.selectedInputTypesState.value.push(selectedInputTypeState.value);

      selectedInputTypeState.addEventListener("change", () => {
        this.selectedInputTypesState.value[index] =
          selectedInputTypeState.value;
      });

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
