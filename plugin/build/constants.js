"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOS_USE_FRAMEWORKS_STATEMENT = exports.IOS_HAS_FLIPPER_ARG = exports.IOS_HAS_PRODUCTION_ARG = exports.IOS_URN_ARG_ANCHOR = exports.FLIPPER_FALLBACK = exports.ANDROID_FLIPPER_KEY = exports.EXPO_FLIPPER_TAG = void 0;
/** Base expo tag for dangerous mods */
exports.EXPO_FLIPPER_TAG = "expo-community-flipper";
/** The gradle property containing flipper version info */
exports.ANDROID_FLIPPER_KEY = "FLIPPER_VERSION";
/** If all else fails, try this flipper version */
exports.FLIPPER_FALLBACK = "0.163.0";
/** In iOS, this is the line we anchor to for adding args to use_react_native!() */
exports.IOS_URN_ARG_ANCHOR = /:fabric_enabled => flags\[:fabric_enabled\],/;
/** In a Podfile, this regex tells us the :production arg is already there */
exports.IOS_HAS_PRODUCTION_ARG = /use_react_native!\([\s\S]*:production\s+=>/gm;
/** In a Podfile, this regex tells us the :flipper_configuration arg is already there */
exports.IOS_HAS_FLIPPER_ARG = /use_react_native!\([\s\S]*^\s*:flipper_configuration\s+=>/gm;
/** In a Podfile, this regex detects if use_frameworks is enabled. It also serves as our anchor */
exports.IOS_USE_FRAMEWORKS_STATEMENT = /[\s*]use_frameworks!/gm;
