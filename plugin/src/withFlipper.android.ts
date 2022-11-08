/*
Exports functions to make a set of changes to enable flipper

withFlipper
  (1) gradle.properties
  Set FLIPPER_VERSION if required
*/

import { withGradleProperties } from "expo/config-plugins";
import { ANDROID_FLIPPER_KEY, FLIPPER_FALLBACK } from "./constants";
import { type FlipperConfig } from "./types";
import { type ExpoConfig } from "expo/config";

export function withFlipperAndroid(
  config: ExpoConfig,
  cfg: FlipperConfig
): ExpoConfig {
  return withGradleProperties(config, (c) => {
    // check for flipper version in package. If set, use that
    let existing: string | undefined;

    const found = c.modResults.filter(
      (item) => item.type === "property" && item.key === ANDROID_FLIPPER_KEY
    )?.[0];
    if (found && found.type === "property") {
      existing = found.value;
    }

    // strip flipper key and re-add
    c.modResults = c.modResults.filter(
      (item) => !(item.type === "property" && item.key === ANDROID_FLIPPER_KEY)
    );
    c.modResults.push({
      type: "property",
      key: ANDROID_FLIPPER_KEY,
      value: cfg.version ?? existing ?? FLIPPER_FALLBACK,
    });

    return c;
  });
}
