"use strict";
/*
Exports functions to make a set of changes to enable flipper

withFlipper
  (1) gradle.properties
  Set FLIPPER_VERSION if required
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFlipperAndroid = void 0;
const config_plugins_1 = require("expo/config-plugins");
const constants_1 = require("./constants");
function withFlipperAndroid(config, cfg) {
    return (0, config_plugins_1.withGradleProperties)(config, (c) => {
        var _a, _b, _c;
        // check for flipper version in package. If set, use that
        let existing;
        const found = (_a = c.modResults.filter((item) => item.type === "property" && item.key === constants_1.ANDROID_FLIPPER_KEY)) === null || _a === void 0 ? void 0 : _a[0];
        if (found && found.type === "property") {
            existing = found.value;
        }
        // strip flipper key and re-add
        c.modResults = c.modResults.filter((item) => !(item.type === "property" && item.key === constants_1.ANDROID_FLIPPER_KEY));
        c.modResults.push({
            type: "property",
            key: constants_1.ANDROID_FLIPPER_KEY,
            value: (_c = (_b = cfg.version) !== null && _b !== void 0 ? _b : existing) !== null && _c !== void 0 ? _c : constants_1.FLIPPER_FALLBACK,
        });
        return c;
    });
}
exports.withFlipperAndroid = withFlipperAndroid;
