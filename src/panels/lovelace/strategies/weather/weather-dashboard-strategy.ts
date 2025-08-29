import { ReactiveElement } from "lit";
import { customElement } from "lit/decorators";
import type { LovelaceConfig } from "../../../../data/lovelace/config/types";
import type { LovelaceStrategyEditor } from "../types";
import type { WeatherViewStrategyConfig } from "./weather-view-strategy";

export interface WeatherDashboardStrategyConfig {
  type: "weather";
  weather_entity: string;
}

@customElement("weather-dashboard-strategy")
export class WeatherDashboardStrategy extends ReactiveElement {
  static async generate(
    config: WeatherDashboardStrategyConfig
  ): Promise<LovelaceConfig> {
    return {
      views: [
        {
          title: "Weather",
          path: "weather",
          icon: "mdi:weather-partly-cloudy",
          strategy: {
            type: "weather",
            weather_entity: config.weather_entity,
          } satisfies WeatherViewStrategyConfig,
        },
      ],
    };
  }

  public static async getConfigElement(): Promise<LovelaceStrategyEditor> {
    await import(
      "../../editor/dashboard-strategy-editor/hui-weather-dashboard-strategy-editor"
    );
    return document.createElement("hui-weather-dashboard-strategy-editor");
  }

  static configRequired = true;
}

declare global {
  interface HTMLElementTagNameMap {
    "weather-dashboard-strategy": WeatherDashboardStrategy;
  }
}
