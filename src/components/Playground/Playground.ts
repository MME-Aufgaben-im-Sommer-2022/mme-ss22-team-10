import WebComponent from "../../lib/components/WebComponent";
import html from "./Playground.html";
import css from "./Playground.css";
import State from "../../lib/state/State";
import Editor from "../Editor/Editor/Editor";
import { info, log, trace } from "../../lib/utils/Logger";
import { AppEvent } from "../../lib/events/AppEvent";
import DataManager from "../../data/DataManager";
import { BlockContentInputType } from "../../data/models/EditorModel";

export default class Playground extends WebComponent {
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
        firstBlockInputState = new State("heyyy");

      log(editorModelState, blockContentsState, firstBlockInputState);

      editorModelState.addEventListener("change", (event: AppEvent) => {
        log("editorModel changed", event.data);
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
        editorModelState.value.blockContents[0].inputValue = "hello";
      });

      button2.addEventListener("click", () => {
        blockContentsState.value[0].inputValue = "hello";

        log("----- after events -----");
        log(blockContentsState.value);
        log(firstBlockInputState.value);
      });

      button3.addEventListener("click", () => {
        editorModelState.value.blockContents[0].inputValue = "FROM DA TOP";
      });

      /*      const editor = new Editor(editorModelState);
      this.select("div")!.appendChild(editor);
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
      });*/
    });
  }
}
