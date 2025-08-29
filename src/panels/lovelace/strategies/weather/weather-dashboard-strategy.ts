import { ReactiveElement } from "lit";
import { customElement } from "lit/decorators";
import type { LovelaceConfig } from "../../../../data/lovelace/config/types";
import type { LovelaceStrategyEditor } from "../types";
import type { WeatherViewStrategyConfig } from "./weather-view-strategy";

export interface WeatherDashboardStrategyConfig {
  type: "weather";
  location?: string;
  units?: "metric" | "imperial";
  show_forecast?: boolean;
  show_current?: boolean;
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
            location: config.location,
            units: config.units,
            show_forecast: config.show_forecast,
            show_current: config.show_current,
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
