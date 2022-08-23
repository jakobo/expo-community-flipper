"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfiguration = void 0;
function getConfiguration(options) {
    let flipperVersion;
    if (typeof options === "string") {
        flipperVersion = options;
    }
    else if (typeof options === "object") {
        if (options.version) {
            flipperVersion = options.version;
        }
    }
    return {
        version: flipperVersion,
    };
}
exports.getConfiguration = getConfiguration;
