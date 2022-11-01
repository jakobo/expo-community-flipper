import { type ExpoConfig } from "expo/config";
import { type ExpoConfigWithMods } from "../types";
import withFlipper from "../withFlipper";

describe(withFlipper, () => {
  it("SDK47 - should leave android config alone on android.enabled=false", () => {
    const ecf = {
      version: "0.999.0",
      ios: { enabled: true },
      android: { enabled: false },
    };
    const config: ExpoConfig = {
      name: "sdk47-disable",
      slug: "sdk47-disable",
      plugins: [["../withFlipper", ecf]],
    };
    withFlipper(config, ecf);
    expect((config as ExpoConfigWithMods).mods.android).toBeUndefined();
  });
});
