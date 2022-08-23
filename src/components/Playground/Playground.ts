/* eslint-disable */
// @ts-nocheck
import WebComponent from "../../lib/components/WebComponent";
import html from "./Playground.html";
import css from "./Playground.css";
import State from "../../lib/state/State";
import { info, log, trace } from "../../lib/utils/Logger";
import { AppEvent } from "../../lib/events/AppEvent";
import DataManager from "../../data/DataManager";
import EditorModel, {
  BlockContent,
  BlockContentInputType,
} from "../../data/models/EditorModel";
import Editor from "../Editor/Editor/Editor";
import { generateRandomLoremIpsum } from "../../lib/utils";
import { StateChangedData } from "../../events/StateChanged";
import Home from "../Home/Home";
import { Topic } from "../../data/models/TemplateConfigurationModel";
import TopicTitleSelection from "../TemplateConfiguration/TopicTitleSelection/TopicTitleSelection";

export default class Playground extends WebComponent {
  editor: Editor;
  constructor() {
    super(html, css);
  }

  get htmlTagName(): string {
    return "dev-playground";
  }

  onCreate(): void {
    // write your playground code here
    // the dev playground won't be appended in production
    const editorModel = DataManager.getEditorModel(new Date());

    editorModel.then((editorModel) => {
      const editorModelState = new State(editorModel),
        blockContentsState = editorModelState.createSubState(
          "value.blockContents"
        ),
        firstBlockInputState = new State("fdf");

      editorModelState.addEventListener("change", (event: AppEvent) => {
        log("editorModel changed", event.data);
        const data = event.data as StateChangedData;
        if (data.property === "") {
          this.editor.remove();
          this.editor = new Editor(editorModelState);
          this.select("div")!.appendChild(this.editor);
        }
      });

      blockContentsState.addEventListener("change", (event: AppEvent) => {
        log("blockContentsState changed", event.data);
      });

      firstBlockInputState.addEventListener("change", (event: AppEvent) => {
        log("inputState changed", event.data);
      });

      const button1 = this.select("#button-1"),
        button2 = this.select("#button-2"),
        button3 = this.select("#button-3");

      button1?.addEventListener("click", () => {
        editorModelState.value = this.createOtherFakeEditor();
      });

      button2.addEventListener("click", () => {
        blockContentsState.value[0].inputValue = "hello";

        log("----- after events -----");
        log(blockContentsState.value);
        log(firstBlockInputState.value);
      });

      // this.createEditor(editorModelState);
      //const home = new Home();
      //this.select("div")!.appendChild(home);
      const topic: Topic = {
          name: "Topic 1",
          titles: ["Title 1", "Title 2", "Title 3"],
        },
        topicState = new State(topic),
        selectionIndexState = new State(0),
        topicTitleSelection = new TopicTitleSelection(
          topicState,
          selectionIndexState
        );
      this.select("div")!.appendChild(topicTitleSelection);

      button3.addEventListener("click", () => {
        selectionIndexState.value = 1;
      });
    });
  }

  private createEditor(editorModelState: State<EditorModel>): void {
    this.editor = new Editor(editorModelState);
    this.select("div")!.appendChild(this.editor);
    this.select("button")!.addEventListener("click", () => {
      log("click");
      editorModelState.value.blockContents[0] = {
        inputType: BlockContentInputType.BulletPoint,
        title: "Bullet Point",
        inputValue: "",
      };
    });

    editorModelState.addEventListener("change", (event: AppEvent) => {
      info("editorModel changed", event.data);
    });
  }

  private createOtherFakeEditor(): EditorModel {
    const day = new Date(),
      blockContents: Array<BlockContent> = [];

    blockContents.push({
      title: `Title 1 new`,
      inputType: BlockContentInputType.Checkbox,
      inputValue: `1___unchecked
        0___checked`,
    });
    blockContents.push({
      title: `Title 2 new`,
      inputType: BlockContentInputType.FreeText,
      inputValue: generateRandomLoremIpsum(100),
    });
    blockContents.push({
      title: `Title 3`,
      inputType: BlockContentInputType.FreeText,
      inputValue: `fsdfffffffffffffffffffff`,
    });

    return new EditorModel(day, blockContents);
  }
}
