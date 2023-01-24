/** Base expo tag for dangerous mods */
export const EXPO_FLIPPER_TAG = "expo-community-flipper";

/** The gradle property containing flipper version info */
export const ANDROID_FLIPPER_KEY = "FLIPPER_VERSION";

/** If all else fails, try this flipper version */
export const FLIPPER_FALLBACK = "0.163.0";

/** In iOS, this is the line we anchor to for adding args to use_react_native!() */
export const IOS_URN_ARG_ANCHOR =
  /:fabric_enabled => flags\[:fabric_enabled\],/;

/** In a Podfile, this regex tells us the :production arg is already there */
export const IOS_HAS_PRODUCTION_ARG =
  /use_react_native!\([\s\S]*:production\s+=>/gm;

/** In a Podfile, this regex tells us the :flipper_configuration arg is already there */
export const IOS_HAS_FLIPPER_ARG =
  /use_react_native!\([\s\S]*^\s*:flipper_configuration\s+=>/gm;

/** In a Podfile, this regex detects if use_frameworks is enabled. It also serves as our anchor */
export const IOS_USE_FRAMEWORKS_STATEMENT = /[\s*]use_frameworks!/gm;
