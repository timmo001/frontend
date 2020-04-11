import {
  applyThemesOnElement,
  invalidateThemeCache,
} from "../common/dom/apply_themes_on_element";
import { storeState } from "../util/ha-pref-storage";
import { subscribeThemes } from "../data/ws-themes";
import { HassBaseEl } from "./hass-base-mixin";
import { HASSDomEvent } from "../common/dom/fire_event";
import { Constructor, Theme } from "../types";

declare global {
  // for add event listener
  interface HTMLElementEventMap {
    settheme: HASSDomEvent<string>;
  }
}

export default <T extends Constructor<HassBaseEl>>(superClass: T) =>
  class extends superClass {
    protected firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
      this.addEventListener("settheme", (ev) => {
        this._updateHass({ selectedTheme: ev.detail });
        this._applyTheme();
        storeState(this.hass!);
      });
    }

    protected hassConnected() {
      super.hassConnected();

      subscribeThemes(this.hass!.connection, (themes) => {
        this._updateHass({ themes });
        invalidateThemeCache();
        this._applyTheme();
      });
    }

    private _applyTheme() {
      applyThemesOnElement(
        document.documentElement,
        this.hass!.themes,
        this.hass!.selectedTheme || this.hass!.themes.default_theme
      );

      const meta = document.querySelector("meta[name=theme-color]");
      const headerColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--app-header-background-color");
      if (meta) {
        if (!meta.hasAttribute("default-content")) {
          meta.setAttribute("default-content", meta.getAttribute("content")!);
        }
        const themeColor =
          headerColor.trim() ||
          (meta.getAttribute("default-content") as string);
        meta.setAttribute("content", themeColor);
      }

      this._setThemePreload(
        this.hass!.themes[
          this.hass!.selectedTheme || this.hass!.themes.default_theme
        ]
      );
    }

    private _setThemePreload(theme: Theme) {
      localStorage.setItem(
        "theme-primary-background-color",
        theme["primary-background-color"]
      );
      localStorage.setItem(
        "theme-primary-text-color",
        theme["primary-text-color"]
      );
    }
  };
