import WebComponentLoader from "./lib/components/WebComponentLoader";
import GlobalState from "./lib/state/GlobalState";
import DataManager from "./data/DataManager";
import "./styles/main.css";
import { log } from "./lib/utils/Logger";
import Login from "./components/Login/Login";
import TemplateConfigurator from "./components/TemplateConfigurator/TemplateConfigurator";
import Home from "./components/Home/Home";
import { GlobalStates } from "./state/GlobalStates";
import { ToastFactory } from "./components/atomics/Toast/ToastFactory";
import { ToastDuration, ToastType } from "./components/atomics/Toast/Toast";

const app = () => {
  const $app = document.querySelector<HTMLDivElement>("#app")!;

  WebComponentLoader.loadAll() // Initialize the WebComponent definitions
    .then(() => DataManager.init()) // Initialize the database connection etc.
    .then(() => GlobalState.init()) // Initialize the global state
    .then(() => onApplicationStart()); // Start the application

  async function onApplicationStart() {
    const IS_IN_DEV_MODE = import.meta.env.DEV;
    if (IS_IN_DEV_MODE) {
      // temp disable
      // appendDevPlayground();
    }

    await onProductionStart();
  }

  async function onProductionStart() {
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
      onReturningUser(userModel.username);
    }
  }

  async function onReturningUser(username: string) {
    log("returning user");
    $showHome();
    new ToastFactory()
      .setMessage(`👋 Welcome back ${username}!`)
      .setType(ToastType.Info)
      .setDuration(ToastDuration.Short)
      .show();
  }

  async function $showHome() {
    $app.innerHTML = "";
    $app.append(new Home());
  }

  async function onNewUser() {
    log("new user");
    $showTemplateConfigurator();
    new ToastFactory()
      .setMessage("🎉 Welcome, please configure your template!")
      .setType(ToastType.Info)
      .setDuration(ToastDuration.Medium)
      .show();
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
    new ToastFactory()
      .setMessage("👋 Bye bye - see you soon!")
      .setType(ToastType.Info)
      .setDuration(ToastDuration.Short)
      .show();
    $showLogin();
  }

  function $showLogin() {
    $app.innerHTML = "";
    const loginPage = new Login();
    $app.append(loginPage);
  }
};

app();
