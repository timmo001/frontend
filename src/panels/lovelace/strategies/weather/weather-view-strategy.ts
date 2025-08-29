import { ReactiveElement } from "lit";
import { customElement } from "lit/decorators";
import type { LovelaceViewConfig } from "../../../../data/lovelace/config/view";
import type { GridCardConfig, WeatherViewCardConfig } from "../../cards/types";

export interface WeatherViewStrategyConfig {
  type: "weather";
  weather_entity: string;
}

@customElement("weather-view-strategy")
export class WeatherViewStrategy extends ReactiveElement {
  static async generate(
    config: WeatherViewStrategyConfig
  ): Promise<LovelaceViewConfig> {
    return {
      type: "sections",
      sections: [
        {
          type: "grid",
          cards: [
            {
              type: "weather-view",
              entity: config.weather_entity,
            } as WeatherViewCardConfig,
          ],
        } as GridCardConfig,
      ],
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "weather-view-strategy": WeatherViewStrategy;
  }
}
