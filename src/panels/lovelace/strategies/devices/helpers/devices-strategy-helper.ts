import type { DeviceRegistryEntry } from "../../../../../data/device_registry";
import type { HomeAssistant } from "../../../../../types";
import { computeDomain } from "../../../../../common/entity/compute_domain";
import { computeStateName } from "../../../../../common/entity/compute_state_name";
import type { EntityFilterFunc } from "../../../../../common/entity/entity_filter";
import { generateEntityFilter } from "../../../../../common/entity/entity_filter";
import { stripPrefixFromEntityName } from "../../../../../common/entity/strip_prefix_from_entity_name";
import type { LovelaceCardConfig } from "../../../../../data/lovelace/config/card";
import { supportsAlarmModesCardFeature } from "../../../card-features/hui-alarm-modes-card-feature";
import { supportsCoverOpenCloseCardFeature } from "../../../card-features/hui-cover-open-close-card-feature";
import { supportsLightBrightnessCardFeature } from "../../../card-features/hui-light-brightness-card-feature";
import { supportsLockCommandsCardFeature } from "../../../card-features/hui-lock-commands-card-feature";
import { supportsTargetTemperatureCardFeature } from "../../../card-features/hui-target-temperature-card-feature";
import type {
  LovelaceCardFeatureConfig,
  LovelaceCardFeatureContext,
} from "../../../card-features/types";
import type { TileCardConfig } from "../../../cards/types";

export const DEVICE_STRATEGY_GROUPS = [
  "lights",
  "climate",
  "covers",
  "media_players",
  "security",
  "actions",
  "others",
] as const;

export const DEVICE_STRATEGY_GROUP_ICONS = {
  lights: "mdi:lamps",
  climate: "mdi:home-thermometer",
  covers: "mdi:blinds-horizontal",
  media_players: "mdi:multimedia",
  security: "mdi:security",
  actions: "mdi:robot",
  others: "mdi:shape",
};

export type DeviceStrategyGroup = (typeof DEVICE_STRATEGY_GROUPS)[number];

type DeviceEntitiesByGroup = Record<DeviceStrategyGroup, string[]>;

type DeviceFilteredByGroup = Record<DeviceStrategyGroup, EntityFilterFunc[]>;

export const getDeviceGroupedEntities = (
  device: string,
  hass: HomeAssistant
): DeviceEntitiesByGroup => {
  const allEntities = Object.keys(hass.states);

  const groupedFilters: DeviceFilteredByGroup = {
    lights: [
      generateEntityFilter(hass, {
        domain: "light",
        device: device,
        entity_category: "none",
      }),
    ],
    covers: [
      generateEntityFilter(hass, {
        domain: "cover",
        device: device,
        entity_category: "none",
      }),
      generateEntityFilter(hass, {
        domain: "binary_sensor",
        device: device,
        device_class: ["door", "garage_door", "window"],
        entity_category: "none",
      }),
    ],
    climate: [
      generateEntityFilter(hass, {
        domain: "climate",
        device: device,
        entity_category: "none",
      }),
      generateEntityFilter(hass, {
        domain: "humidifier",
        device: device,
        entity_category: "none",
      }),
      generateEntityFilter(hass, {
        domain: "water_heater",
        device: device,
        entity_category: "none",
      }),
      generateEntityFilter(hass, {
        domain: "fan",
        device: device,
        entity_category: "none",
      }),
    ],
    media_players: [
      generateEntityFilter(hass, {
        domain: "media_player",
        device: device,
        entity_category: "none",
      }),
    ],
    security: [
      generateEntityFilter(hass, {
        domain: "alarm_control_panel",
        device: device,
        entity_category: "none",
      }),
      generateEntityFilter(hass, {
        domain: "lock",
        device: device,
        entity_category: "none",
      }),
      generateEntityFilter(hass, {
        domain: "camera",
        device: device,
        entity_category: "none",
      }),
    ],
    actions: [
      generateEntityFilter(hass, {
        domain: ["script", "scene"],
        device: device,
        entity_category: "none",
      }),
      generateEntityFilter(hass, {
        domain: ["automation"],
        device: device,
        entity_category: "none",
      }),
    ],
    others: [
      generateEntityFilter(hass, {
        domain: "vacuum",
        device: device,
        entity_category: "none",
      }),
      generateEntityFilter(hass, {
        domain: "lawn_mower",
        device: device,
        entity_category: "none",
      }),
      generateEntityFilter(hass, {
        domain: "valve",
        device: device,
        entity_category: "none",
      }),
      generateEntityFilter(hass, {
        domain: ["switch", "button", "input_boolean", "input_button"],
        device: device,
        entity_category: "none",
      }),
      generateEntityFilter(hass, {
        domain: [
          "select",
          "number",
          "input_select",
          "input_number",
          "counter",
          "timer",
        ],
        device: device,
        entity_category: "none",
      }),
    ],
  };

  return Object.fromEntries(
    Object.entries(groupedFilters).map(([group, filters]) => {
      const entities = filters.reduce<string[]>(
        (acc, filter) => [
          ...acc,
          ...allEntities.filter((entity) => filter(entity)),
        ],
        []
      );

      return [group, entities];
    })
  ) as DeviceEntitiesByGroup;
};

export const computeDeviceTileCardConfig =
  (hass: HomeAssistant, prefix: string, includeFeature?: boolean) =>
  (entity: string): LovelaceCardConfig => {
    const stateObj = hass.states[entity];

    const context: LovelaceCardFeatureContext = {
      entity_id: entity,
    };

    const additionalCardConfig: Partial<TileCardConfig> = {};

    const domain = computeDomain(entity);

    if (domain === "camera") {
      return {
        type: "picture-entity",
        entity: entity,
        show_state: false,
        show_name: false,
        grid_options: {
          columns: 6,
          rows: 2,
        },
      };
    }

    let feature: LovelaceCardFeatureConfig | undefined;
    if (includeFeature) {
      if (supportsLightBrightnessCardFeature(hass, context)) {
        feature = {
          type: "light-brightness",
        };
      } else if (supportsCoverOpenCloseCardFeature(hass, context)) {
        feature = {
          type: "cover-open-close",
        };
      } else if (supportsTargetTemperatureCardFeature(hass, context)) {
        feature = {
          type: "target-temperature",
        };
      } else if (supportsAlarmModesCardFeature(hass, context)) {
        feature = {
          type: "alarm-modes",
        };
      } else if (supportsLockCommandsCardFeature(hass, context)) {
        feature = {
          type: "lock-commands",
        };
      }
    }

    if (feature) {
      additionalCardConfig.features = [feature];
    }

    const name = computeStateName(stateObj);
    const stripedName = stripPrefixFromEntityName(name, prefix.toLowerCase());

    return {
      type: "tile",
      entity: entity,
      name: stripedName,
      ...additionalCardConfig,
    };
  };

export const getDevices = (
  entries: HomeAssistant["devices"],
  devices: string[]
): DeviceRegistryEntry[] => {
  const filteredDevices = devices
    .filter((device) => device in entries)
    .map((device) => entries[device]);

  return filteredDevices;
};

export const computeDevicePath = (deviceId: string): string =>
  `devices-${deviceId}`;
