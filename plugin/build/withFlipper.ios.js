"use strict";
/*
exports the following config file changes for iOS Apps

withFlipper
  (1) Inside use_react_native, after :fabric_enabled => flags[:fabric_enabled],
  :flipper_configuration => FlipperConfiguration.enabled,
  :flipper_configuration => FlipperConfiguration.disabled,

  Depending on the ENV variable

withProductionEnv
  (1) BEFORE target line
  production = ENV["PRODUCTION"] == "1"

  (2) Inside use_react_native, after :path => config[:reactNativePath],
  :production => production,
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFlipperIOS = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const constants_1 = require("./constants");
const util_1 = require("./util");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/** Create a namepaced tag */
const tag = (s) => `${constants_1.EXPO_FLIPPER_TAG}-${s}`;
/** Return the flipper enabling line for use inside of use_react_native */
const createFlipperArgument = (version) => {
    const active = version
        ? `FlipperConfiguration.enabled(["Debug"], { 'Flipper' => '${version}' }),`
        : `FlipperConfiguration.enabled,`;
    const inactive = `FlipperConfiguration.disabled`;
    return `:flipper_configuration => ENV['FLIPPER_DISABLE'] ? ${inactive} : ${active}`;
};
/** Removes content by its tag */
const removeTaggedContent = (contents, ns) => {
    return (0, generateCode_1.removeContents)({ src: contents, tag: tag(ns) });
};
/** Determines if flipper is linked. For now, a no-op until autolink detection exists */
async function isFlipperLinked() {
    // TODO: Autolink detection when supported
    return true;
}
/** Add the production arg to the use_react_native block */
function withEnvProductionPodfile(config) {
    config = (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        async (c) => {
            const filePath = path_1.default.join(c.modRequest.platformProjectRoot, "Podfile");
            const contents = fs_1.default.readFileSync(filePath, "utf-8");
            // #3 We cannot tell if a merge failed because of a malformed podfile or it was a noop
            // so instead, remove the content first, then attempt the insert
            let result;
            result = removeTaggedContent(contents, "isprod");
            const preexisting = constants_1.IOS_HAS_PRODUCTION_ARG.test(result.contents);
            if (!preexisting) {
                result = (0, generateCode_1.mergeContents)({
                    tag: tag("isprod"),
                    src: result.contents,
                    newSrc: `
            # https://www.npmjs.com/package/expo-community-flipper
            :production => ENV["PRODUCTION"] == "1" ? true : false,`,
                    anchor: constants_1.IOS_URN_ARG_ANCHOR,
                    offset: -1,
                    comment: "#",
                });
                // couldn't remove and couldn't add. Treat the operation as failed
                if (!result.didMerge) {
                    throw new Error("Cannot add use_flipper to the project's ios/Podfile. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command.");
                }
            }
            fs_1.default.writeFileSync(filePath, result.contents);
            return c;
        },
    ]);
    return config;
}
/** Add flipper to the podfile, behind an ENV flag */
function withFlipperPodfile(config, cfg) {
    config = (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        async (c) => {
            const filePath = path_1.default.join(c.modRequest.platformProjectRoot, "Podfile");
            const contents = fs_1.default.readFileSync(filePath, "utf-8");
            const flipperPath = (0, util_1.getReactNativeFlipperPath)(c.modRequest.projectRoot);
            const linked = isFlipperLinked();
            if (!flipperPath || !linked) {
                return c;
            }
            // #3 We cannot tell if a merge failed because of a malformed podfile or it was a noop
            // so instead, remove the content first, then attempt the insert
            let result;
            result = removeTaggedContent(contents, "urn");
            const preexisting = constants_1.IOS_HAS_FLIPPER_ARG.test(result.contents);
            if (!preexisting) {
                result = (0, generateCode_1.mergeContents)({
                    tag: tag("urn"),
                    src: result.contents,
                    newSrc: `
            # https://www.npmjs.com/package/expo-community-flipper
            ${createFlipperArgument(cfg.version)}`,
                    anchor: constants_1.IOS_URN_ARG_ANCHOR,
                    offset: 1,
                    comment: "#",
                });
                // couldn't remove and couldn't add. Treat the operation as failed
                if (!result.didMerge) {
                    throw new Error("Cannot add use_flipper to the project's ios/Podfile. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command.");
                }
            }
            fs_1.default.writeFileSync(filePath, result.contents);
            return c;
        },
    ]);
    return config;
}
function withFlipperIOS(config, cfg) {
    config = withEnvProductionPodfile(config);
    config = withFlipperPodfile(config, cfg);
    return config;
}
exports.withFlipperIOS = withFlipperIOS;
