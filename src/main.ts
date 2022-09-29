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

/**
 * The main entry point of the app
 */
const app = () => {
  const $app = document.querySelector<HTMLDivElement>("#app")!;

  WebComponentLoader.loadAll() // Initialize the WebComponent definitions
    .then(() => DataManager.init()) // Initialize the database connection etc.
    .then(() => GlobalState.init()) // Initialize the global state
    .then(() => onApplicationStart()); // Start the application

  /**
   * This function is called when the application is ready to start
   */
  async function onApplicationStart() {
    await onProductionStart();
  }

  /**
   * Main entry point for the "real" app
   */
  async function onProductionStart() {
    const isLoggedIn = await DataManager.checkIfUserLoggedIn();
    if (isLoggedIn) {
      await onLoggedIn();
    } else {
      await onLoggedOut();
    }
  }

  /**
   * Called when the user is logged in
   * - calls {@link onReturningUser} if the user is returning
   * - or {@link onNewUser} if the user is new
   */
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

  /**
   * Called when a returning user logs in
   * -> show the {@link Home} component
   * @param username The username of the user
   */
  async function onReturningUser(username: string) {
    log("returning user");
    $showHome();
    new ToastFactory()
      .setMessage(`👋 Welcome back ${username}!`)
      .setType(ToastType.Info)
      .setDuration(ToastDuration.Short)
      .show();
  }

  /**
   * Shows the {@link Home} component
   */
  async function $showHome() {
    $app.innerHTML = "";
    $app.append(new Home());
  }

  /**
   * Called when a new user logs in
   * -> show the {@link TemplateConfigurator} component
   */
  async function onNewUser() {
    log("new user");
    $showTemplateConfigurator();
    new ToastFactory()
      .setMessage("🎉 Welcome, please configure your template!")
      .setType(ToastType.Info)
      .setDuration(ToastDuration.Medium)
      .show();
  }

  /**
   * Shows the {@link TemplateConfigurator} component
   */
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

  /**
   * Called when the user is logged out
   * -> show the {@link Login} component
   */
  async function onLoggedOut() {
    log("user is logged out");
    new ToastFactory()
      .setMessage("👋 Bye bye - see you soon!")
      .setType(ToastType.Info)
      .setDuration(ToastDuration.Short)
      .show();
    $showLogin();
  }

  /**
   * Shows the {@link Login} component
   */
  function $showLogin() {
    $app.innerHTML = "";
    const loginPage = new Login();
    $app.append(loginPage);
  }
};

app(); // start the app
