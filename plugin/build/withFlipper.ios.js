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
exports.withFlipperIOS = exports.updatePodfileContentsWithFlipper = exports.updatePodfileContentsWithProductionFlag = void 0;
const config_plugins_1 = require("expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ts_dedent_1 = __importDefault(require("ts-dedent"));
/** Create a namepaced tag */
const tag = (s) => `${constants_1.EXPO_FLIPPER_TAG}-${s}`;
/** Return the flipper enabling line for use inside of use_react_native */
const createFlipperArgument = (version) => {
    // support NO_FLIPPER
    if (process.env.NO_FLIPPER === "1") {
        return `:flipper_configuration => FlipperConfiguration.disabled`;
    }
    const active = version
        ? `FlipperConfiguration.enabled(["Debug", "Release"], { 'Flipper' => '${version}' }),`
        : `FlipperConfiguration.enabled(["Debug", "Release"]),`;
    return `:flipper_configuration => ${active}`;
};
/** Removes content by its tag */
const removeTaggedContent = (contents, ns) => {
    return (0, generateCode_1.removeContents)({ src: contents, tag: tag(ns) });
};
/** Grab the last merge results operation */
const last = (arr) => {
    const l = arr[arr.length - 1];
    if (typeof l === "undefined") {
        throw new Error("No prior results. This is a bug in expo-community-flipper and should be reported");
    }
    return l;
};
/** Indent code, making generated podfile changes a bit more readable */
const indent = (block, size) => {
    return (typeof block === "string" ? block.split("\n") : block)
        .map((s) => `${" ".repeat(size)}${s}`)
        .join("\n");
};
/** Add the production arg to the use_react_native block */
function withEnvProductionPodfile(config) {
    config = (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        async (c) => {
            const filePath = path_1.default.join(c.modRequest.platformProjectRoot, "Podfile");
            const contents = fs_1.default.readFileSync(filePath, "utf-8");
            const updatedContents = updatePodfileContentsWithProductionFlag(contents);
            fs_1.default.writeFileSync(filePath, updatedContents);
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
            const updatedContents = updatePodfileContentsWithFlipper(contents, cfg);
            fs_1.default.writeFileSync(filePath, updatedContents);
            return c;
        },
    ]);
    return config;
}
/** Add the production arg to the use_react_native block */
function withoutUseFrameworks(config) {
    config = (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        async (c) => {
            const TAG_HEADER = "ufwhead";
            const TAG_FOOTER = "ufwfoot";
            const filePath = path_1.default.join(c.modRequest.platformProjectRoot, "Podfile");
            const contents = fs_1.default.readFileSync(filePath, "utf-8");
            // #3 We cannot tell if a merge failed because of a malformed podfile or it was a noop
            // so instead, remove the content first, then attempt the insert
            const results = [];
            results.push(removeTaggedContent(contents, TAG_HEADER));
            results.push(removeTaggedContent(last(results).contents, TAG_FOOTER));
            const preexisting = constants_1.IOS_USE_FRAMEWORKS_STATEMENT.test(last(results).contents);
            if (!preexisting) {
                // no work to do
                return c;
            }
            results.push((0, generateCode_1.mergeContents)({
                tag: tag(TAG_HEADER),
                src: last(results).contents,
                // block comments must be left-aligned to work in ruby
                newSrc: (0, ts_dedent_1.default) `
            =begin
            expo-community-flipper stripUseFrameworks=true
          `,
                anchor: constants_1.IOS_USE_FRAMEWORKS_STATEMENT,
                offset: 0,
                comment: "#",
            }));
            results.push((0, generateCode_1.mergeContents)({
                tag: tag(TAG_FOOTER),
                src: last(results).contents,
                // block comments must be left-aligned to work in ruby
                newSrc: (0, ts_dedent_1.default) `
            =end
          `,
                anchor: constants_1.IOS_USE_FRAMEWORKS_STATEMENT,
                offset: 1,
                comment: "#",
            }));
            // couldn't remove and couldn't add. Treat the operation as failed
            if (!last(results).didMerge) {
                throw new Error("Cannot remove use_frameworks in the project's ios/Podfile. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command.");
            }
            fs_1.default.writeFileSync(filePath, last(results).contents);
            return c;
        },
    ]);
    return config;
}
/** Given Podfile contents, edit the file via regexes to insert the production flag for hermes if required */
function updatePodfileContentsWithProductionFlag(contents) {
    // #3 We cannot tell if a merge failed because of a malformed podfile or it was a noop
    // so instead, remove the content first, then attempt the insert
    const results = [];
    results.push(removeTaggedContent(contents, "isprod"));
    // Hermes/Flipper used to care about ENV.PRODUCTION
    // Before we add the arg, we check to see if the keyed argument
    // is already passed into use_react_native
    const preexisting = constants_1.IOS_HAS_PRODUCTION_ARG.test(last(results).contents);
    if (!preexisting) {
        results.push((0, generateCode_1.mergeContents)({
            tag: tag("isprod"),
            src: last(results).contents,
            newSrc: indent([
                "# ENV value added to support Hermes",
                ':production => ENV["PRODUCTION"] == "1" ? true : false,',
            ], 4),
            anchor: constants_1.IOS_URN_ARG_ANCHOR,
            offset: -1,
            comment: "#",
        }));
    }
    // couldn't remove and couldn't add. Treat the operation as failed
    if (!last(results).didMerge) {
        throw new Error("Cannot add use_flipper to the project's ios/Podfile. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command.");
    }
    return last(results).contents;
}
exports.updatePodfileContentsWithProductionFlag = updatePodfileContentsWithProductionFlag;
/** Given Podfile contents, edit the file via regexes to insert the flipper arguments */
function updatePodfileContentsWithFlipper(contents, cfg) {
    // #3 We cannot tell if a merge failed because of a malformed podfile or it was a noop
    // so instead, remove the content first, then attempt the insert
    const results = [];
    results.push(removeTaggedContent(contents, "urn"));
    const preexisting = constants_1.IOS_HAS_FLIPPER_ARG.test(last(results).contents);
    if (!preexisting) {
        results.push((0, generateCode_1.mergeContents)({
            tag: tag("urn"),
            src: last(results).contents,
            newSrc: indent([createFlipperArgument(cfg.version)], 4),
            anchor: constants_1.IOS_URN_ARG_ANCHOR,
            offset: 1,
            comment: "#",
        }));
    }
    // couldn't remove and couldn't add. Treat the operation as failed
    if (!last(results).didMerge) {
        throw new Error("Cannot add flipper arguments to the project's ios/Podfile. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command.");
    }
    return last(results).contents;
}
exports.updatePodfileContentsWithFlipper = updatePodfileContentsWithFlipper;
function withFlipperIOS(config, cfg) {
    config = withEnvProductionPodfile(config);
    config = withFlipperPodfile(config, cfg);
    if (cfg.ios.stripUseFrameworks === true) {
        config = withoutUseFrameworks(config);
    }
    return config;
}
exports.withFlipperIOS = withFlipperIOS;
