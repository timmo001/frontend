import { ReactiveElement } from "lit";
import { customElement } from "lit/decorators";
import { clamp } from "../../../../common/number/clamp";
import type { LovelaceViewConfig } from "../../../../data/lovelace/config/view";
import type { HomeAssistant } from "../../../../types";
import type { LovelaceSectionRawConfig } from "../../../../data/lovelace/config/section";
import type { LovelaceBadgeConfig } from "../../../../data/lovelace/config/badge";

export interface DeviceViewStrategyConfig {
  type: "device";
  device: string;
  title?: string;
}

@customElement("device-view-strategy")
export class DeviceViewStrategy extends ReactiveElement {
  static async generate(
    config: DeviceViewStrategyConfig,
    hass: HomeAssistant
  ): Promise<LovelaceViewConfig> {
    const device = hass.devices[config.device];

    if (!device) {
      throw new Error("Unknown device");
    }

    const sections: LovelaceSectionRawConfig[] = [];

    const badges: LovelaceBadgeConfig[] = [];

    // Allow between 2 and 3 columns (the max should be set to define the width of the header)
    const maxColumns = clamp(sections.length, 2, 3);

    // Take the full width if there is only one section to avoid narrow header on desktop
    if (sections.length === 1) {
      sections[0].column_span = 2;
    }

    return {
      type: "sections",
      header: {
        badges_position: "bottom",
        layout: "responsive",
        card: {
          type: "markdown",
          text_only: true,
          content: `## ${device.name}`,
        },
      },
      max_columns: maxColumns,
      sections: sections,
      badges: badges,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "device-view-strategy": DeviceViewStrategy;
  }
}
