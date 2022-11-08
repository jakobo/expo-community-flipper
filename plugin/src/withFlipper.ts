import { getConfiguration } from "./util";
import { withFlipperIOS } from "./withFlipper.ios";
import { withFlipperAndroid } from "./withFlipper.android";
import { type ConfigPlugin } from "expo/config-plugins";
import { type WithFlipperOptions } from "./types";

/** Enable flipper on this application */
export const withFlipper: ConfigPlugin<WithFlipperOptions> = (
  config,
  options
) => {
  const opts = getConfiguration(options);

  if (opts.ios.enabled) {
    config = withFlipperIOS(config, opts);
  }

  if (opts.android.enabled) {
    config = withFlipperAndroid(config, opts);
  }

  return config;
};

export default withFlipper;
