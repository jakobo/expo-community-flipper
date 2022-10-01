"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfiguration = void 0;
function getConfiguration(options) {
    var _a, _b;
    const base = typeof options === "string"
        ? { version: options }
        : options !== null && options !== void 0 ? options : {
            version: undefined,
            ios: true,
            android: true,
        };
    return {
        version: base.version,
        ios: typeof base.ios !== "undefined" && typeof base.ios !== "boolean"
            ? {
                enabled: base.ios.enabled,
                // disabled by default
                stripUseFrameworks: base.ios.stripUseFrameworks === false ? false : true,
            }
            : {
                enabled: (_a = base.ios) !== null && _a !== void 0 ? _a : true,
                stripUseFrameworks: false,
            },
        android: typeof base.android !== "undefined" && typeof base.android !== "boolean"
            ? {
                enabled: base.android.enabled,
            }
            : {
                enabled: (_b = base.android) !== null && _b !== void 0 ? _b : true,
            },
    };
}
exports.getConfiguration = getConfiguration;
