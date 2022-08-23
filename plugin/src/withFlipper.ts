import { ConfigPlugin } from "@expo/config-plugins";
import { WithFlipperOptions } from "./types";
import { getConfiguration } from "./util";
import { withFlipperIOS } from "./withFlipper.ios";
import { withFlipperAndroid } from "./withFlipper.android";

/** Enable flipper on this application */
export const withFlipper: ConfigPlugin<WithFlipperOptions> = (
  config,
  options
) => {
  const opts = getConfiguration(options);
  config = withFlipperIOS(config, opts);
  config = withFlipperAndroid(config, opts);
  return config;
};

export default withFlipper;
