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
const EXPO_FLIPPER_TAG = "expo-community-flipper";
const EXPO_FLIPPER_TAG_POST_INSTALL = "expo-community-flipper-post-install";
function getConfiguration(options) {
    let flipperVersion = null;
    let iosPods = {};
    if (typeof options === "string") {
        flipperVersion = options;
    }
    else if (typeof options === "object") {
        if (options.Flipper) {
            flipperVersion = options.Flipper;
        }
        if (options.ios) {
            iosPods = options.ios;
        }
    }
    return {
        ios: {
            Flipper: flipperVersion,
            ...iosPods,
        },
        android: flipperVersion,
    };
}
async function getReactNativeFlipperPath(projectRoot) {
    const resolved = resolve_from_1.default.silent(projectRoot, "react-native-flipper/package.json");
    return resolved ? path_1.default.dirname(resolved) : null;
}
async function isFlipperLinked() {
    // TODO: Autolink detection when supported
    return true;
}
function addFlipperToPodfile(contents, options) {
    // all flipper pods. Flipper must go first
    const flipperVersions = [];
    const { Flipper, ...rest } = options.ios;
    if (Object.getOwnPropertyNames(rest).length > 0 && !Flipper) {
        throw new Error("You cannot specify additional pods for Flipper without also specifying Flipper");
    }
    if (options.ios.Flipper) {
        flipperVersions.push(`'Flipper' => '${Flipper}'`);
        for (const pod of Object.getOwnPropertyNames(rest)) {
            flipperVersions.push(`'${pod}' => '${rest[pod]}'`);
        }
    }
    // https://react-native-community.github.io/upgrade-helper/?from=0.63.0&to=0.64.2
    // https://github.com/expo/expo/tree/master/templates/expo-template-bare-minimum/
    const versionString = flipperVersions.length
        ? `{${flipperVersions.join(", ")}}`
        : "";
    // #3 We cannot tell if a merge failed because of a malformed podfile or it was a noop
    // so instead, remove the content first, then attempt the insert
    let removeResult;
    let addResult;
    // remove previous instances for idempotence
    removeResult = (0, generateCode_1.removeContents)({ src: contents, tag: EXPO_FLIPPER_TAG });
    removeResult = (0, generateCode_1.removeContents)({
        src: removeResult.contents,
        tag: EXPO_FLIPPER_TAG_POST_INSTALL,
    });
    // insert use_flipper statement
    addResult = (0, generateCode_1.mergeContents)({
        tag: EXPO_FLIPPER_TAG,
        src: removeResult.contents,
        newSrc: `
      # Flipper support successfully added via expo config plugin
      # https://www.npmjs.com/package/expo-community-flipper
      if !ENV['FLIPPER_DISABLE']
        use_flipper!(${versionString})
      end
    `,
        anchor: /# Uncomment to opt-in to using Flipper/,
        offset: -1,
        comment: "#",
    });
    // couldn't remove and couldn't add. Treat the operation as failed
    if (!addResult.didMerge) {
        throw new Error("Cannot add use_flipper to the project's ios/Podfile. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command.");
    }
    // insert post_install statement inside the post_install loop
    addResult = (0, generateCode_1.mergeContents)({
        tag: EXPO_FLIPPER_TAG_POST_INSTALL,
        src: addResult.contents,
        newSrc: `
      # Flipper support successfully added via expo config plugin
      # https://www.npmjs.com/package/expo-community-flipper
      if !ENV['FLIPPER_DISABLE']
        flipper_post_install(installer)
      end
    `,
        anchor: /post_install do \|installer\|/,
        offset: 1,
        comment: "#",
    });
    // couldn't remove and couldn't add. Treat the operation as failed
    if (!addResult.didMerge) {
        throw new Error("Cannot add flipper_post_install to the project's ios/Podfile. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command.");
    }
    return addResult.contents;
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
    const flipperKey = "FLIPPER_VERSION";
    return (0, config_plugins_1.withGradleProperties)(config, (c) => {
        if (options.android) {
            // strip flipper key and re-add
            c.modResults = c.modResults.filter((item) => !(item.type === "property" && item.key === flipperKey));
            c.modResults.push({
                type: "property",
                key: flipperKey,
                value: options.android,
            });
        }
        return c;
    });
}
const withFlipper = (config, options) => {
    const opts = getConfiguration(options);
    config = withIosFlipper(config, opts);
    config = withAndroidFlipper(config, opts);
    return config;
};
exports.withFlipper = withFlipper;
exports.default = exports.withFlipper;
