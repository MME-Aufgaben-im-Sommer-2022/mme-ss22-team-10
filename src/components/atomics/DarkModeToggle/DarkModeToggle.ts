/* eslint-disable no-magic-numbers */
import WebComponent from "../../../lib/components/WebComponent";

import css from "./DarkModeToggle.css";
import lottie, { AnimationItem, AnimationSegment } from "lottie-web";
import State from "../../../lib/state/State";
import MoonSunToggleAnimationData from "./DarkModeToggleData.json";
import { STATE_CHANGE_EVENT } from "../../../events/StateChanged";
import DataManager from "../../../data/DataManager";

/**
 * The different segments of the animation
 */
const ToggleSegment = {
  /**
   * The segment that is played to go from light mode to dark mode
   */
  Light: [0, 50] as AnimationSegment,
  /**
   * The segment that is played to go from dark mode to light mode
   */
  Dark: [51, 96] as AnimationSegment,
};

// ADAPTED FROM: https://github.com/cawfree/react-dark-mode-toggle

/**
 * @class DarkModeToggle
 * A toggle that allows the user to switch between light and dark mode.
 */
export default class DarkModeToggle extends WebComponent {
  private readonly isCheckedState = new State(false);
  private animationData!: AnimationItem;

  constructor() {
    super(undefined, css);
  }

  onCreate(): void | Promise<void> {
    this.isCheckedState.value = DataManager.getDarkMode();
    this.$initAnimation();
    this.initListener();
  }

  get htmlTagName(): string {
    return "moon-sun-toggle";
  }

  /**
   * Initialise the animation.
   * @private
   */
  private $initAnimation(): void {
    this.animationData = lottie.loadAnimation({
      container: this,
      animationData: MoonSunToggleAnimationData,
      loop: false,
      renderer: "svg",
      autoplay: false,
    });
    this.animationData.setSpeed(1.4);

    // go to dark mode if dark mode is enabled
    if (this.isCheckedState.value) {
      this.animationData.goToAndStop(51, true);
    }

    // update the display
    this.updateDarkModeDisplay();
  }

  private initListener(): void {
    this.select("svg > g")?.addEventListener("click", () => {
      this.isCheckedState.value = !this.isCheckedState.value;
    });

    this.isCheckedState.addEventListener(STATE_CHANGE_EVENT, () => {
      // after .5 seconds the animation will be done
      setTimeout(() => this.updateDarkModeDisplay(), 300);
      DataManager.setDarkMode(this.isCheckedState.value);
      const segment = this.isCheckedState.value
        ? ToggleSegment.Light
        : ToggleSegment.Dark;
      this.animationData.playSegments(segment, true);
    });
  }

  private updateDarkModeDisplay(): void {
    if (this.isCheckedState.value) {
      document.body.classList.add("theme-dark");
      document.body.classList.remove("theme-light");
    } else {
      document.body.classList.add("theme-light");
      document.body.classList.remove("theme-dark");
    }
  }
}
