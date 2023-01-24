/** Base expo tag for dangerous mods */
export declare const EXPO_FLIPPER_TAG = "expo-community-flipper";
/** The gradle property containing flipper version info */
export declare const ANDROID_FLIPPER_KEY = "FLIPPER_VERSION";
/** If all else fails, try this flipper version */
export declare const FLIPPER_FALLBACK = "0.163.0";
/** In iOS, this is the line we anchor to for adding args to use_react_native!() */
export declare const IOS_URN_ARG_ANCHOR: RegExp;
/** In a Podfile, this regex tells us the :production arg is already there */
export declare const IOS_HAS_PRODUCTION_ARG: RegExp;
/** In a Podfile, this regex tells us the :flipper_configuration arg is already there */
export declare const IOS_HAS_FLIPPER_ARG: RegExp;
/** In a Podfile, this regex detects if use_frameworks is enabled. It also serves as our anchor */
export declare const IOS_USE_FRAMEWORKS_STATEMENT: RegExp;
