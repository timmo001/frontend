import { STATE_NOT_RUNNING } from "home-assistant-js-websocket";
import { ReactiveElement } from "lit";
import { customElement } from "lit/decorators";
import type { LovelaceConfig } from "../../../../data/lovelace/config/types";
import type { LovelaceStrategyEditor } from "../types";
import type { HomeAssistant } from "../../../../types";
import {
  computeDevicePath,
  getDevices,
} from "./helpers/devices-strategy-helper";
import type { LovelaceViewRawConfig } from "../../../../data/lovelace/config/view";
import type { DeviceViewStrategyConfig } from "./device-view-strategy";

export interface DevicesDashboardStrategyConfig {
  type: "devices";
  devices: string[];
}

@customElement("devices-dashboard-strategy")
export class DevicesDashboardStrategy extends ReactiveElement {
  static async generate(
    config: DevicesDashboardStrategyConfig,
    hass: HomeAssistant
  ): Promise<LovelaceConfig> {
    if (hass.config.state === STATE_NOT_RUNNING) {
      return {
        views: [
          {
            type: "sections",
            sections: [{ cards: [{ type: "starting" }] }],
          },
        ],
      };
    }

    if (hass.config.recovery_mode) {
      return {
        views: [
          {
            type: "sections",
            sections: [{ cards: [{ type: "recovery-mode" }] }],
          },
        ],
      };
    }

    const devices = getDevices(hass.devices, config.devices);

    const deviceViews = devices.map<LovelaceViewRawConfig>((device) => {
      const path = computeDevicePath(device.id);

      return {
        title: device.name,
        path: path,
        strategy: {
          type: "device",
          device: device.id,
        } satisfies DeviceViewStrategyConfig,
      };
    });

    return {
      views: deviceViews,
    };
  }

  public static async getConfigElement(): Promise<LovelaceStrategyEditor> {
    await import(
      "../../editor/dashboard-strategy-editor/hui-devices-dashboard-strategy-editor"
    );
    return document.createElement("hui-devices-dashboard-strategy-editor");
  }

  static configRequired = true;
}

declare global {
  interface HTMLElementTagNameMap {
    "devices-dashboard-strategy": DevicesDashboardStrategy;
  }
}
