import WebComponentLoader from "./lib/components/WebComponentLoader";
import GlobalState from "./lib/state/GlobalState";
import DataManager from "./data/DataManager";
import Playground from "./components/Playground/Playground";
import "./styles/main.css";
import "doodle.css/doodle.css";

const app = () => {
  WebComponentLoader.loadAll() // Initialize the WebComponent definitions
    .then(() => DataManager.init()) // Initialize the database connection etc.
    .then(() => GlobalState.init()) // Initialize the global state
    .then(() => onApplicationStart()); // Start the application

  const appendDevPlayground = () => {
    const playground = new Playground();
    document.querySelector<HTMLDivElement>("#app")!.append(playground);
  };

  function onApplicationStart() {
    const IS_IN_DEV_MODE = import.meta.env.DEV;
    if (IS_IN_DEV_MODE) {
      appendDevPlayground();
    }

    // production code here
  }
};

app();
