import type { TemplateResult } from "lit";
import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators";
import {
  saveFrontendUserData,
  type CoreFrontendUserData,
} from "../../data/frontend";
import type { HomeAssistant } from "../../types";
import "../../components/ha-alert";
import "../../components/ha-card";
import "../../components/ha-settings-row";
import "../../components/ha-switch";

@customElement("ha-streamer-mode-row")
class StreamerModeRow extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow = false;

  @property({ attribute: false }) public coreUserData?: CoreFrontendUserData;

  @state() private _error?: string;

  protected render(): TemplateResult {
    return html`
      ${this._error
        ? html`<ha-alert alert-type="error">${this._error}</ha-alert>`
        : nothing}

      <ha-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${this.hass.localize("ui.panel.profile.streamer_mode.header")}
        </span>
        <span slot="description">
          ${this.hass.localize("ui.panel.profile.streamer_mode.description")}
        </span>
        <ha-switch
          .checked=${this.coreUserData && this.coreUserData.streamerMode}
          .disabled=${this.coreUserData === undefined}
          @change=${this._toggled}
        ></ha-switch>
      </ha-settings-row>
    `;
  }

  private async _toggled(ev: Event) {
    try {
      saveFrontendUserData(this.hass.connection, "core", {
        ...this.coreUserData,
        streamerMode: (ev.target as HTMLInputElement).checked,
      });
    } catch (err: any) {
      this._error = err.message || err;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-streamer-mode-row": StreamerModeRow;
  }
}
