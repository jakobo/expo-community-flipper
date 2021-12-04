"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFlipper = exports.addFlipperToPodfile = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const resolve_from_1 = __importDefault(require("resolve-from"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
async function getReactNativeFlipperPath(projectRoot) {
    const resolved = resolve_from_1.default.silent(projectRoot, "react-native-flipper/package.json");
    return resolved ? path_1.default.dirname(resolved) : null;
}
async function isFlipperLinked() {
    // TODO: Autolink detection when supported
    return true;
}
function addFlipperToPodfile(contents, options) {
    let flipperVersion = null;
    let iosPods = null;
    if (typeof options === "string") {
        flipperVersion = options;
    }
    else if (typeof options === "object" && options.ios) {
        flipperVersion = options.Flipper || null;
        iosPods = options.ios;
    }
    const flipperVersions = [];
    if (flipperVersion) {
        flipperVersions.push(`'Flipper' => '${flipperVersion}'`);
        if (iosPods) {
            for (const pod of Object.getOwnPropertyNames(iosPods)) {
                flipperVersions.push(`'${pod}' => '${iosPods[pod]}'`);
            }
        }
    }
    // https://react-native-community.github.io/upgrade-helper/?from=0.63.0&to=0.64.2
    // https://github.com/expo/expo/tree/master/templates/expo-template-bare-minimum/
    const versionString = flipperVersions.length
        ? `{${flipperVersions.join(", ")}}`
        : "";
    const enableFlipper = (0, generateCode_1.mergeContents)({
        tag: "flipper",
        src: contents,
        newSrc: `  use_flipper!(${versionString})`,
        anchor: /# Uncomment to opt-in to using Flipper/,
        offset: 0,
        comment: "#",
    });
    if (!enableFlipper.didMerge) {
        throw new Error("Cannot add Flipper to the project's ios/Podfile because it's malformed. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command.");
    }
    return enableFlipper.contents;
}
exports.addFlipperToPodfile = addFlipperToPodfile;
function withIosFlipper(config, options) {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        async (c) => {
            const filePath = path_1.default.join(c.modRequest.platformProjectRoot, "Podfile");
            const contents = fs_1.default.readFileSync(filePath, "utf-8");
            const flipperPath = await getReactNativeFlipperPath(c.modRequest.projectRoot);
            const linked = isFlipperLinked();
            if (!flipperPath || !linked) {
                return c;
            }
            const results = addFlipperToPodfile(contents, options);
            fs_1.default.writeFileSync(filePath, results);
            return c;
        },
    ]);
}
function withAndroidFlipper(config, options) {
    let flipperVersion = null;
    if (typeof options === "string") {
        flipperVersion = options;
    }
    else if (typeof options === "object" && options.ios) {
        flipperVersion = options.Flipper || null;
    }
    const flipperKey = "FLIPPER_VERSION";
    return (0, config_plugins_1.withGradleProperties)(config, (c) => {
        if (flipperVersion) {
            // strip flipper key and re-add
            c.modResults = c.modResults.filter((item) => !(item.type === "property" && item.key === flipperKey));
            c.modResults.push({
                type: "property",
                key: flipperKey,
                value: flipperVersion,
            });
        }
        return c;
    });
}
const withFlipper = (config, options) => {
    config = withIosFlipper(config, options);
    config = withAndroidFlipper(config, options);
    return config;
};
exports.withFlipper = withFlipper;
exports.default = exports.withFlipper;
