import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators";
import { isValidEntityId } from "../../../common/entity/valid_entity_id";
import type { HomeAssistant } from "../../../types";
import type { LovelaceCard, LovelaceCardEditor } from "../types";
import type { WeatherViewCardConfig } from "./types";

@customElement("hui-weather-view-card")
class HuiWeatherViewCard extends LitElement implements LovelaceCard {
  public static async getConfigElement(): Promise<LovelaceCardEditor | null> {
    return null;
  }

  public static getStubConfig(): object {
    return { type: "weather-view" };
  }

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: WeatherViewCardConfig;

  public getCardSize(): number {
    return 1;
  }

  public setConfig(config: WeatherViewCardConfig): void {
    if (!config.entity) {
      throw new Error("Entity must be specified");
    }
    if (!isValidEntityId(config.entity)) {
      throw new Error("Invalid entity");
    }

    this._config = config;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <div>
        <p>Weather View Card</p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-weather-view-card": HuiWeatherViewCard;
  }
}
