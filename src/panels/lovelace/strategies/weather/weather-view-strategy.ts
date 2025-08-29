import { ReactiveElement } from "lit";
import { customElement } from "lit/decorators";
import type { LovelaceViewConfig } from "../../../../data/lovelace/config/view";
import type { LovelaceStrategyEditor } from "../types";

export interface WeatherViewStrategyConfig {
  type: "weather";
  location?: string;
  units?: "metric" | "imperial";
  show_forecast?: boolean;
  show_current?: boolean;
}

@customElement("weather-view-strategy")
export class WeatherViewStrategy extends ReactiveElement {
  static async generate(
    config: WeatherViewStrategyConfig
  ): Promise<LovelaceViewConfig> {
    const cards = [];

    // Add current weather card if enabled
    if (config.show_current !== false) {
      cards.push({
        type: "weather-forecast",
        entity: "weather.home", // Default entity, could be configurable
        show_conditions: true,
        show_temperature: true,
        show_humidity: true,
        show_pressure: true,
        show_wind: true,
        show_forecast: false,
      });
    }

    // Add forecast card if enabled
    if (config.show_forecast !== false) {
      cards.push({
        type: "weather-forecast",
        entity: "weather.home", // Default entity, could be configurable
        show_conditions: true,
        show_temperature: true,
        show_forecast: true,
        forecast_days: 5,
      });
    }

    // Add weather map card
    cards.push({
      type: "map",
      entities: ["zone.home"], // Default zone, could be configurable
      hours_to_show: 0,
      geo_location_sources: ["zone"],
    });

    // Add weather sensors card
    cards.push({
      type: "entities",
      title: "Weather Sensors",
      entities: [
        {
          entity: "sensor.outdoor_temperature",
          name: "Outdoor Temperature",
        },
        {
          entity: "sensor.outdoor_humidity",
          name: "Outdoor Humidity",
        },
        {
          entity: "sensor.wind_speed",
          name: "Wind Speed",
        },
        {
          entity: "sensor.rainfall",
          name: "Rainfall",
        },
      ],
      show_header_toggle: false,
    });

    return {
      type: "sections",
      sections: [
        {
          type: "grid",
          column_span: 2,
          cards: cards,
        },
      ],
    };
  }

  public static async getConfigElement(): Promise<LovelaceStrategyEditor> {
    // For now, no editor needed as this is a simple strategy
    throw new Error("No editor available for weather view strategy");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "weather-view-strategy": WeatherViewStrategy;
  }
}
