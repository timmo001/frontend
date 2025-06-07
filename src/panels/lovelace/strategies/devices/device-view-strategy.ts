import { ReactiveElement } from "lit";
import { customElement } from "lit/decorators";
import { clamp } from "../../../../common/number/clamp";
import type { LovelaceViewConfig } from "../../../../data/lovelace/config/view";
import type { HomeAssistant } from "../../../../types";
import type { LovelaceSectionRawConfig } from "../../../../data/lovelace/config/section";
import type { LovelaceBadgeConfig } from "../../../../data/lovelace/config/badge";
import type { LovelaceCardConfig } from "../../../../data/lovelace/config/card";
import {
  computeDeviceTileCardConfig,
  DEVICE_STRATEGY_GROUP_ICONS,
  getDeviceGroupedEntities,
} from "./helpers/devices-strategy-helper";

export interface DeviceViewStrategyConfig {
  type: "device";
  device: string;
  title?: string;
}

const computeHeadingCard = (
  heading: string,
  icon: string
): LovelaceCardConfig => ({
  type: "heading",
  heading: heading,
  icon: icon,
});

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

    const badges: LovelaceBadgeConfig[] = [];
    const sections: LovelaceSectionRawConfig[] = [];

    const groupedEntities = getDeviceGroupedEntities(config.device, hass);

    const computeTileCard = computeDeviceTileCardConfig(
      hass,
      device.name ?? "Unknown Device",
      true
    );

    const {
      lights,
      climate,
      covers,
      media_players,
      security,
      actions,
      others,
    } = groupedEntities;

    if (lights.length > 0) {
      sections.push({
        type: "grid",
        cards: [
          computeHeadingCard(
            hass.localize("ui.panel.lovelace.strategy.areas.groups.lights"),
            DEVICE_STRATEGY_GROUP_ICONS.lights
          ),
          ...lights.map(computeTileCard),
        ],
      });
    }

    if (covers.length > 0) {
      sections.push({
        type: "grid",
        cards: [
          computeHeadingCard(
            hass.localize("ui.panel.lovelace.strategy.areas.groups.covers"),
            DEVICE_STRATEGY_GROUP_ICONS.covers
          ),
          ...covers.map(computeTileCard),
        ],
      });
    }

    if (climate.length > 0) {
      sections.push({
        type: "grid",
        cards: [
          computeHeadingCard(
            hass.localize("ui.panel.lovelace.strategy.areas.groups.climate"),
            DEVICE_STRATEGY_GROUP_ICONS.climate
          ),
          ...climate.map(computeTileCard),
        ],
      });
    }

    if (media_players.length > 0) {
      sections.push({
        type: "grid",
        cards: [
          computeHeadingCard(
            hass.localize(
              "ui.panel.lovelace.strategy.areas.groups.media_players"
            ),
            DEVICE_STRATEGY_GROUP_ICONS.media_players
          ),
          ...media_players.map(computeTileCard),
        ],
      });
    }

    if (security.length > 0) {
      sections.push({
        type: "grid",
        cards: [
          computeHeadingCard(
            hass.localize("ui.panel.lovelace.strategy.areas.groups.security"),
            DEVICE_STRATEGY_GROUP_ICONS.security
          ),
          ...security.map(computeTileCard),
        ],
      });
    }

    if (actions.length > 0) {
      sections.push({
        type: "grid",
        cards: [
          computeHeadingCard(
            hass.localize("ui.panel.lovelace.strategy.areas.groups.actions"),
            DEVICE_STRATEGY_GROUP_ICONS.actions
          ),
          ...actions.map(computeTileCard),
        ],
      });
    }

    if (others.length > 0) {
      sections.push({
        type: "grid",
        cards: [
          computeHeadingCard(
            hass.localize("ui.panel.lovelace.strategy.areas.groups.others"),
            DEVICE_STRATEGY_GROUP_ICONS.others
          ),
          ...others.map(computeTileCard),
        ],
      });
    }

    // Allow between 2 and 3 columns (the max should be set to define the width of the header)
    const maxColumns = clamp(sections.length, 2, 3);

    // Take the full width if there is only one section to avoid narrow header on desktop
    if (sections.length === 1) {
      sections[0].column_span = 2;
    }

    return {
      type: "sections",
      max_columns: maxColumns,
      badges: badges,
      sections: sections,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "device-view-strategy": DeviceViewStrategy;
  }
}
