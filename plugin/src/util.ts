import { FlipperConfig, WithFlipperOptions } from "./types";

export function getConfiguration(options?: WithFlipperOptions): FlipperConfig {
  const base =
    typeof options === "string"
      ? { version: options }
      : options ?? {
          version: undefined,
          ios: true,
          android: true,
        };

  return {
    version: base.version,
    ios:
      typeof base.ios !== "undefined" && typeof base.ios !== "boolean"
        ? {
            enabled: base.ios.enabled,
            // disabled by default
            stripUseFrameworks:
              base.ios.stripUseFrameworks === false ? false : true,
          }
        : {
            enabled: base.ios ?? true,
            stripUseFrameworks: false,
          },
    android:
      typeof base.android !== "undefined" && typeof base.android !== "boolean"
        ? {
            enabled: base.android.enabled,
          }
        : {
            enabled: base.android ?? true,
          },
  };
}
