import "@polymer/iron-autogrow-textarea/iron-autogrow-textarea";
import "@material/mwc-button";
import "@polymer/paper-card/paper-card";
import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  PropertyValues,
  TemplateResult,
  query,
} from "lit-element";

import { HomeAssistant, Route } from "../../../src/types";
import {
  HassioAddonDetails,
  setHassioAddonOption,
  HassioAddonSetOptionParams,
} from "../../../src/data/hassio/addon";
import { hassioStyle } from "../resources/hassio-style";
import { haStyle } from "../../../src/resources/styles";
import { fireEvent } from "../../../src/common/dom/fire_event";
import "../../../src/components/ha-yaml-editor";
// tslint:disable-next-line: no-duplicate-imports
import { HaYamlEditor } from "../../../src/components/ha-yaml-editor";
import { showConfirmationDialog } from "../../../src/dialogs/generic/show-dialog-box";
import { getAddonSections } from "./data/hassio-addon-sections";

import "../../../src/layouts/hass-tabs-subpage";

@customElement("hassio-addon-config")
class HassioAddonConfig extends LitElement {
  @property() public hass!: HomeAssistant;
  @property() public addon!: HassioAddonDetails;
  @property() public narrow!: boolean;
  @property() public isWide!: boolean;
  @property() public showAdvanced!: boolean;
  @property() public route!: Route;
  @property() private _error?: string;
  @property({ type: Boolean }) private _configHasChanged = false;

  @query("ha-yaml-editor") private _editor!: HaYamlEditor;

  protected render(): TemplateResult {
    const editor = this._editor;
    // If editor not rendered, don't show the error.
    const valid = editor ? editor.isValid : true;

    return html`
      <hass-tabs-subpage
        .hass=${this.hass}
        .narrow=${this.narrow}
        .route=${this.route}
        .tabs=${getAddonSections(this.addon)}
        hassio
      >
        <div class="container">
          <div class="content">
            <paper-card heading="Config">
              <div class="card-content">
                <ha-yaml-editor
                  @value-changed=${this._configChanged}
                ></ha-yaml-editor>
                ${this._error
                  ? html`
                      <div class="errors">${this._error}</div>
                    `
                  : ""}
                ${valid
                  ? ""
                  : html`
                      <div class="errors">Invalid YAML</div>
                    `}
              </div>
              <div class="card-actions">
                <mwc-button class="warning" @click=${this._resetTapped}>
                  Reset to defaults
                </mwc-button>
                <mwc-button
                  @click=${this._saveTapped}
                  .disabled=${!this._configHasChanged || !valid}
                >
                  Save
                </mwc-button>
              </div>
            </paper-card>
          </div>
        </div>
      </hass-tabs-subpage>
    `;
  }

  static get styles(): CSSResult[] {
    return [
      haStyle,
      hassioStyle,
      css`
        .container {
          display: flex;
          width: 100%;
          justify-content: center;
        }
        .content {
          display: flex;
          width: 600px;
          margin-bottom: 24px;
          padding: 24px 0 32px;
          flex-direction: column;
        }
        @media only screen and (max-width: 600px) {
          .content {
            max-width: 100%;
            min-width: 100%;
          }
        }
        paper-card {
          display: block;
        }
        .card-actions {
          display: flex;
          justify-content: space-between;
        }
        .errors {
          color: var(--google-red-500);
          margin-top: 16px;
        }
        iron-autogrow-textarea {
          width: 100%;
          font-family: monospace;
        }
        .syntaxerror {
          color: var(--google-red-500);
        }
      `,
    ];
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has("addon")) {
      this._editor.setValue(this.addon.options);
    }
  }

  private _configChanged(): void {
    this._configHasChanged = true;
    this.requestUpdate();
  }

  private async _resetTapped(): Promise<void> {
    const confirmed = await showConfirmationDialog(this, {
      title: this.addon.name,
      text: "Are you sure you want to reset all your options?",
      confirmText: "reset options",
    });

    if (!confirmed) {
      return;
    }

    this._error = undefined;
    const data: HassioAddonSetOptionParams = {
      options: null,
    };
    try {
      await setHassioAddonOption(this.hass, this.addon.slug, data);
      this._configHasChanged = false;
      const eventdata = {
        success: true,
        response: undefined,
        path: "options",
      };
      fireEvent(this, "hass-api-called", eventdata);
    } catch (err) {
      this._error = `Failed to reset addon configuration, ${err.body?.message ||
        err}`;
    }
  }

  private async _saveTapped(): Promise<void> {
    let data: HassioAddonSetOptionParams;
    this._error = undefined;
    try {
      data = {
        options: this._editor.value,
      };
    } catch (err) {
      this._error = err;
      return;
    }
    try {
      await setHassioAddonOption(this.hass, this.addon.slug, data);
      this._configHasChanged = false;
      const eventdata = {
        success: true,
        response: undefined,
        path: "options",
      };
      fireEvent(this, "hass-api-called", eventdata);
    } catch (err) {
      this._error = `Failed to save addon configuration, ${err.body?.message ||
        err}`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hassio-addon-config": HassioAddonConfig;
  }
}
