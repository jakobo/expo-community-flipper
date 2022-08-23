"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfiguration = exports.getReactNativeFlipperPath = void 0;
const resolve_from_1 = __importDefault(require("resolve-from"));
const path_1 = __importDefault(require("path"));
/** Gets the native flipper path */
function getReactNativeFlipperPath(projectRoot) {
    const resolved = resolve_from_1.default.silent(projectRoot, "react-native-flipper/package.json");
    return resolved ? path_1.default.dirname(resolved) : undefined;
}
exports.getReactNativeFlipperPath = getReactNativeFlipperPath;
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
