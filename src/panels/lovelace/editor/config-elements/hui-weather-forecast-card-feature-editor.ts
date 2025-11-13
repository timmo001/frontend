import type { HassEntity } from "home-assistant-js-websocket";
import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators";
import memoizeOne from "memoize-one";
import { fireEvent } from "../../../../common/dom/fire_event";
import type { LocalizeFunc } from "../../../../common/translations/localize";
import "../../../../components/ha-form/ha-form";
import type {
  HaFormSchema,
  SchemaUnion,
} from "../../../../components/ha-form/types";
import type { ModernForecastType } from "../../../../data/weather";
import { getSupportedForecastTypes } from "../../../../data/weather";
import type { HomeAssistant } from "../../../../types";
import type {
  LovelaceCardFeatureContext,
  WeatherForecastCardFeatureConfig,
} from "../../card-features/types";
import type { LovelaceCardFeatureEditor } from "../../types";

@customElement("hui-weather-forecast-card-feature-editor")
export class HuiWeatherForecastCardFeatureEditor
  extends LitElement
  implements LovelaceCardFeatureEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public context?: LovelaceCardFeatureContext;

  @state() private _config?: WeatherForecastCardFeatureConfig;

  public setConfig(config: WeatherForecastCardFeatureConfig): void {
    this._config = config;
  }

  private _schema = memoizeOne(
    (localize: LocalizeFunc, stateObj: HassEntity | undefined) => {
      const supportedTypes = stateObj
        ? getSupportedForecastTypes(stateObj)
        : (["daily", "hourly", "twice_daily"] as ModernForecastType[]);

      return [
        {
          name: "forecast_type",
          selector: {
            select: {
              multiple: false,
              mode: "list",
              options: supportedTypes.map((type) => ({
                value: type,
                label: localize(
                  `ui.panel.lovelace.editor.card.weather-forecast.${type}`
                ),
              })),
            },
          },
        },
        {
          name: "forecast_slots",
          selector: {
            number: {
              min: 1,
              max: 12,
              mode: "box",
            },
          },
        },
      ] as const satisfies readonly HaFormSchema[];
    }
  );

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const stateObj = this.context?.entity_id
      ? this.hass.states[this.context?.entity_id]
      : undefined;

    const schema = this._schema(this.hass.localize, stateObj);

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${this._computeLabelCallback}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    fireEvent(this, "config-changed", { config: ev.detail.value });
  }

  private _computeLabelCallback = (
    schema: SchemaUnion<ReturnType<typeof this._schema>>
  ) => {
    switch (schema.name) {
      case "forecast_type":
      case "forecast_slots":
        return this.hass!.localize(
          `ui.panel.lovelace.editor.features.types.weather-forecast.${schema.name}`
        );
      default:
        return "";
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-weather-forecast-card-feature-editor": HuiWeatherForecastCardFeatureEditor;
  }
}
