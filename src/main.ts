import WebComponentLoader from "./lib/components/WebComponentLoader";
import GlobalState from "./lib/state/GlobalState";
import DataManager from "./data/DataManager";
import Playground from "./components/Playground/Playground";
import "./styles/main.css";
import { log } from "./lib/utils/Logger";
import State from "./lib/state/State";

const app = () => {
  const $app = document.querySelector<HTMLDivElement>("#app")!;
  const isLoggedIn = new State(false);

  WebComponentLoader.loadAll() // Initialize the WebComponent definitions
    .then(() => DataManager.init()) // Initialize the database connection etc.
    .then(() => GlobalState.init()) // Initialize the global state
    .then(() => onApplicationStart()); // Start the application

  const appendDevPlayground = () => {
    const playground = new Playground();
    $app.append(playground);
  };

  async function onApplicationStart() {
    const IS_IN_DEV_MODE = import.meta.env.DEV;
    if (IS_IN_DEV_MODE) {
      // temp disable
      // appendDevPlayground();
    }

    await onProductionStart();
  }

  async function onProductionStart() {
    const userModel = await DataManager.getUserSettingsModel();
    if (userModel !== undefined) {
      log("logged in", userModel);
      isLoggedIn.value = true;
    } else {
      log("not logged in", userModel);
      isLoggedIn.value = false;
    }
  }
};

app();
