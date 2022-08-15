import WebComponentLoader from "./lib/components/WebComponentLoader";
import State from "./lib/state/State";
import GlobalState from "./lib/state/GlobalState";
import DataManager from "./data/DataManager";
import { log } from "./lib/utils/Logger";
import Editor, { EditorModel } from "./components/editor/Editor/Editor";

const app = () => {
  WebComponentLoader.loadAll() // Initialize the WebComponent definitions
    .then(() => DataManager.init()) // Initialize the database connection etc.
    .then(() => GlobalState.init()) // Initialize the global state
    .then(() => onApplicationStart()); // Start the application

  function onApplicationStart() {
    // retrieve the example Model from the model store
    const editorModelState: State<EditorModel> = new State({
        day: new Date(),
        blockContents: [
          {
            title: "Free text input field",
            inputType: "free-text-input-field",
            inputValue: "gibberish",
          },
          {
            title: "Free text input field",
            inputType: "free-text-input-field",
            inputValue: "even more gibberish",
          },
        ],
      }),
      editor = new Editor(editorModelState);

    document.querySelector<HTMLDivElement>("#app")!.appendChild(editor);

    // listen to changes on the exampleModel
    editorModelState.addEventListener(State.STATE_CHANGE_EVENT, (data: any) => {
      log("MAIN Model changed:", data);
      log(GlobalState);
    });
  }
};

app();
