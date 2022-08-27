import WebComponentLoader from "./lib/components/WebComponentLoader";
import GlobalState from "./lib/state/GlobalState";
import DataManager from "./data/DataManager";
import Playground from "./components/Playground/Playground";
import "./styles/main.css";
import { log } from "./lib/utils/Logger";
import Login from "./components/Login/Login";
import TemplateConfigurator from "./components/TemplateConfigurator/TemplateConfigurator";
import Home from "./components/Home/Home";
import { GlobalStates } from "./state/GlobalStates";

const app = () => {
  const $app = document.querySelector<HTMLDivElement>("#app")!;

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
    await DataManager.signInViaMail("notemplate@mail.de", "123456789");
    const isLoggedIn = await DataManager.checkIfUserLoggedIn();
    if (isLoggedIn) {
      await onLoggedIn();
    } else {
      await onLoggedOut();
    }
  }

  async function onLoggedIn() {
    log("user is logged in");
    const userModel = await DataManager.getUserSettingsModel();
    GlobalState.addState(userModel.toState(), GlobalStates.userSettingsModel);
    if (userModel.settings.template.length === 0) {
      onNewUser();
    } else {
      onReturningUser();
    }
  }

  async function onReturningUser() {
    log("returning user");
    $showHome();
  }

  async function $showHome() {
    const calendarModel = await DataManager.getCalendarModel(),
      editorModel = await DataManager.getEditorModel(new Date());

    GlobalState.addState(calendarModel.toState(), GlobalStates.calendarModel);
    GlobalState.addState(editorModel.toState(), GlobalStates.editorModel);

    $app.innerHTML = "";
    $app.append(new Home());
  }

  async function onNewUser() {
    log("new user");
    $showTemplateConfigurator();
  }

  function $showTemplateConfigurator() {
    $app.innerHTML = "";
    const templateConfigurator = new TemplateConfigurator();
    templateConfigurator.addEventListener(
      TemplateConfigurator.FINISH_TEMPLATE_CONFIGURATION_EVENT,
      () => {
        log("template configurator finished");
        $showHome();
      }
    );
    $app.append(templateConfigurator);
  }

  async function onLoggedOut() {
    log("user is logged out");
    $showLogin();
  }

  function $showLogin() {
    $app.innerHTML = "";
    const loginPage = new Login();
    $app.append(loginPage);
  }
};

app();
