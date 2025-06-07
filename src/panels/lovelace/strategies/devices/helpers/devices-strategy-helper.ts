import type { DeviceRegistryEntry } from "../../../../../data/device_registry";
import type { HomeAssistant } from "../../../../../types";

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
