import WebComponent from "../../../../lib/components/WebComponent";
import html from "./InputTypeConfiguratorItem.html";
import css from "./InputTypeConfiguratorItem.css";
import { BlockContentInputType } from "../../../../data/models/EditorModel";
import { TemplateItem } from "../../../../data/models/UserSettingsModel";

export default class InputTypeConfiguratorItem extends WebComponent {
  private $topicTitle!: HTMLSpanElement;
  private $inputTypeSelection!: HTMLSelectElement;

  private readonly templateItem: TemplateItem;

  constructor(templateItem: TemplateItem) {
    super(html, css);
    this.templateItem = templateItem;
  }

  get htmlTagName(): string {
    return "input-type-configurator-item";
  }

  onCreate(): Promise<void> | void {
    this.$initHtml();
    this.initListener();
  }

  $initHtml(): void {
    this.$topicTitle = this.select(".topic-title")!;
    this.$topicTitle.innerHTML = this.templateItem.title;
    this.$inputTypeSelection = this.select(
      ".input-type-configuration-selection"
    )!;
    this.$appendOptions();
    this.$inputTypeSelection.value = this.templateItem.inputType;
  }

  private initListener(): void {
    this.$inputTypeSelection.addEventListener(
      "change",
      this.$onSelectionChanged
    );
  }

  $onSelectionChanged = (): void => {
    this.templateItem.inputType = this.$inputTypeSelection
      .value as BlockContentInputType;
  };

  private $appendOptions(): void {
    Object.keys(BlockContentInputType).forEach((inputType) => {
      const option = document.createElement("option");
      option.value =
        BlockContentInputType[inputType as keyof typeof BlockContentInputType];
      option.innerHTML = inputType;
      this.$inputTypeSelection.appendChild(option);
    });
  }
}
