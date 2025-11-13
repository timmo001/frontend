import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators";
import { formatDateWeekdayShort } from "../../../common/datetime/format_date";
import { formatTime } from "../../../common/datetime/format_time";
import { isComponentLoaded } from "../../../common/config/is_component_loaded";
import { computeDomain } from "../../../common/entity/compute_domain";
import { formatNumber } from "../../../common/number/format_number";
import "../../../components/ha-svg-icon";
import type { ForecastEvent, WeatherEntity } from "../../../data/weather";
import {
  getDefaultForecastType,
  getForecast,
  getSupportedForecastTypes,
  getWeatherStateIcon,
  getWeatherUnit,
  subscribeForecast,
  weatherSVGStyles,
} from "../../../data/weather";
import type { HomeAssistant } from "../../../types";
import type { LovelaceCardFeature, LovelaceCardFeatureEditor } from "../types";
import { cardFeatureStyles } from "./common/card-feature-styles";
import type {
  LovelaceCardFeatureContext,
  WeatherForecastCardFeatureConfig,
} from "./types";

export const supportsWeatherForecastCardFeature = (
  hass: HomeAssistant,
  context: LovelaceCardFeatureContext
) => {
  const stateObj = context.entity_id
    ? hass.states[context.entity_id]
    : undefined;
  if (!stateObj) return false;
  const domain = computeDomain(stateObj.entity_id);
  if (domain !== "weather") return false;
  // Only support entities with modern forecast features
  return getSupportedForecastTypes(stateObj).length > 0;
};

@customElement("hui-weather-forecast-card-feature")
class HuiWeatherForecastCardFeature
  extends LitElement
  implements LovelaceCardFeature
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public context?: LovelaceCardFeatureContext;

  @state() private _config?: WeatherForecastCardFeatureConfig;

  @state() private _forecastEvent?: ForecastEvent;

  @state() private _subscribed?: Promise<() => void>;

  private get _stateObj() {
    if (!this.hass || !this.context || !this.context.entity_id) {
      return undefined;
    }
    return this.hass.states[this.context.entity_id] as
      | WeatherEntity
      | undefined;
  }

  static getStubConfig(): WeatherForecastCardFeatureConfig {
    return {
      type: "weather-forecast",
    };
  }

  public static async getConfigElement(): Promise<LovelaceCardFeatureEditor> {
    await import(
      "../editor/config-elements/hui-weather-forecast-card-feature-editor"
    );
    return document.createElement("hui-weather-forecast-card-feature-editor");
  }

  public setConfig(config: WeatherForecastCardFeatureConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = config;
  }

  private _unsubscribeForecastEvents() {
    if (this._subscribed) {
      this._subscribed.then((unsub) => unsub());
      this._subscribed = undefined;
    }
  }

  private async _subscribeForecastEvents() {
    this._unsubscribeForecastEvents();
    if (
      !this.isConnected ||
      !this.hass ||
      !this._config ||
      !this._stateObj ||
      !isComponentLoaded(this.hass, "weather")
    ) {
      return;
    }

    const forecastType =
      this._config.forecast_type ||
      getDefaultForecastType(this._stateObj) ||
      "daily";

    this._subscribed = subscribeForecast(
      this.hass,
      this._stateObj.entity_id,
      forecastType,
      (event) => {
        this._forecastEvent = event;
      }
    ).catch((e) => {
      if (e.code === "invalid_entity_id") {
        setTimeout(() => {
          this._subscribed = undefined;
        }, 2000);
      }
      throw e;
    });
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (this.hasUpdated && this._config && this.hass) {
      this._subscribeForecastEvents();
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribeForecastEvents();
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this._config || !this.hass) {
      return;
    }

    if (changedProps.has("_config") || !this._subscribed) {
      this._subscribeForecastEvents();
    }
  }

  protected render(): TemplateResult | null {
    if (
      !this._config ||
      !this.hass ||
      !this.context ||
      !this._stateObj ||
      !supportsWeatherForecastCardFeature(this.hass, this.context)
    ) {
      return null;
    }

    const forecastType =
      this._config.forecast_type ||
      getDefaultForecastType(this._stateObj) ||
      "daily";

    const forecastData = getForecast(
      this._stateObj.attributes,
      this._forecastEvent,
      forecastType
    );

    if (!forecastData || !forecastData.forecast) {
      return null;
    }

    const maxItems = this._config.forecast_slots ?? 5;
    const forecast = forecastData.forecast.slice(0, maxItems);

    return html`
      <div class="forecast-container">
        ${forecast.map((item) => {
          const datetime = new Date(item.datetime);
          const tempHigh = item.temperature;
          const tempLow = item.templow;

          let timeLabel: string;
          if (forecastData.type === "hourly") {
            timeLabel = formatTime(
              datetime,
              this.hass!.locale,
              this.hass!.config
            );
          } else if (item.is_daytime !== undefined) {
            timeLabel = item.is_daytime
              ? this.hass!.localize("ui.card.weather.day")
              : this.hass!.localize("ui.card.weather.night");
          } else {
            timeLabel = formatDateWeekdayShort(
              datetime,
              this.hass!.locale,
              this.hass!.config
            );
          }

          const weatherIcon = item.condition
            ? getWeatherStateIcon(
                item.condition,
                this,
                item.is_daytime === false
              )
            : nothing;

          const tempUnit = getWeatherUnit(
            this.hass!.config,
            this._stateObj!,
            "temperature"
          );

          return html`
            <div class="forecast-item">
              <div class="forecast-time">${timeLabel}</div>
              <div class="forecast-icon">${weatherIcon}</div>
              <div class="forecast-temp">
                ${tempHigh != null
                  ? html`<span class="temp-high"
                      >${formatNumber(
                        tempHigh,
                        this.hass!.locale
                      )}${tempUnit}</span
                    >`
                  : nothing}
                ${tempLow != null
                  ? html`<span class="temp-low"
                      >${formatNumber(
                        tempLow,
                        this.hass!.locale
                      )}${tempUnit}</span
                    >`
                  : nothing}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return [
      cardFeatureStyles,
      weatherSVGStyles,
      css`
        .forecast-container {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 0 4px;
        }

        .forecast-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 60px;
          flex-shrink: 0;
        }

        .forecast-time {
          font-size: 12px;
          color: var(--secondary-text-color);
          white-space: nowrap;
        }

        .forecast-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .forecast-icon ha-svg-icon {
          width: 40px;
          height: 40px;
        }

        .forecast-icon svg {
          width: 40px;
          height: 40px;
        }

        .forecast-temp {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 14px;
          gap: 2px;
        }

        .temp-high {
          color: var(--primary-text-color);
          font-weight: 500;
        }

        .temp-low {
          color: var(--secondary-text-color);
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-weather-forecast-card-feature": HuiWeatherForecastCardFeature;
  }
}
