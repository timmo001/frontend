import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators";
import { fireEvent } from "../../../../common/dom/fire_event";
import "../../../../components/ha-form/ha-form";
import type {
  HaFormSchema,
  SchemaUnion,
} from "../../../../components/ha-form/types";
import type { HomeAssistant } from "../../../../types";
import type { IframeDashboardStrategyConfig } from "../../strategies/iframe/iframe-dashboard-strategy";
import type { LovelaceStrategyEditor } from "../../strategies/types";

const SCHEMA = [
  {
    name: "devices",
    selector: {
      device: {
        multiple: true,
      },
    },
  },
] as const satisfies readonly HaFormSchema[];

@customElement("hui-devices-dashboard-strategy-editor")
export class HuiDevicesDashboarStrategyEditor
  extends LitElement
  implements LovelaceStrategyEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state()
  private _config?: IframeDashboardStrategyConfig;

  public setConfig(config: IframeDashboardStrategyConfig): void {
    this._config = config;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabelCallback}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    const data = ev.detail.value;
    fireEvent(this, "config-changed", { config: data });
  }

  private _computeLabelCallback = (schema: SchemaUnion<typeof SCHEMA>) => {
    switch (schema.name) {
      case "devices":
        return this.hass?.localize(
          `ui.panel.lovelace.editor.strategy.devices.${schema.name}`
        );
      default:
        return "";
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-devices-dashboard-strategy-editor": HuiDevicesDashboarStrategyEditor;
  }
}
