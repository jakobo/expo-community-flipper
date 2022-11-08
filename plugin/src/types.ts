import { type ExpoConfig } from "expo/config";

type iOSFlipperConfig = {
  enabled: boolean;
  stripUseFrameworks?: boolean;
};

type AndroidFlipperConfig = {
  enabled: boolean;
};

export type FlipperConfig = {
  version: string | undefined;
  ios: iOSFlipperConfig;
  android: AndroidFlipperConfig;
};

export type WithFlipperOptions = FlipperOptions | string;

type FlipperOptions = {
  version?: string;
  ios?: boolean | iOSFlipperConfig;
  android?: boolean | AndroidFlipperConfig;
};

export type ExpoConfigWithMods = ExpoConfig & {
  mods: Record<"ios" | "android", Record<string, unknown[]>>;
};
