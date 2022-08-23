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

import { withDangerousMod } from "@expo/config-plugins";
import {
  mergeContents,
  removeContents,
} from "@expo/config-plugins/build/utils/generateCode";
import { ExpoConfig } from "@expo/config-types";
import {
  EXPO_FLIPPER_TAG,
  IOS_HAS_FLIPPER_ARG,
  IOS_HAS_PRODUCTION_ARG,
  IOS_URN_ARG_ANCHOR,
} from "./constants";
import { FlipperConfig } from "./types";
import { getReactNativeFlipperPath } from "./util";
import path from "path";
import fs from "fs";

/** Create a namepaced tag */
const tag = (s: string) => `${EXPO_FLIPPER_TAG}-${s}`;

/** Return the flipper enabling line for use inside of use_react_native */
const createFlipperArgument = (version?: string) => {
  const active = version
    ? `FlipperConfiguration.enabled(["Debug"], { 'Flipper' => '${version}' }),`
    : `FlipperConfiguration.enabled,`;
  const inactive = `FlipperConfiguration.disabled`;
  return `:flipper_configuration => ENV['FLIPPER_DISABLE'] ? ${inactive} : ${active}`;
};

/** Removes content by its tag */
const removeTaggedContent = (contents: string, ns: string) => {
  return removeContents({ src: contents, tag: tag(ns) });
};

/** Determines if flipper is linked. For now, a no-op until autolink detection exists */
async function isFlipperLinked(): Promise<boolean> {
  // TODO: Autolink detection when supported
  return true;
}

/** Add the production arg to the use_react_native block */
function withEnvProductionPodfile(config: ExpoConfig) {
  config = withDangerousMod(config, [
    "ios",
    async (c) => {
      const filePath = path.join(c.modRequest.platformProjectRoot, "Podfile");
      const contents = fs.readFileSync(filePath, "utf-8");

      // #3 We cannot tell if a merge failed because of a malformed podfile or it was a noop
      // so instead, remove the content first, then attempt the insert
      let result;

      result = removeTaggedContent(contents, "isprod");

      const preexisting = IOS_HAS_PRODUCTION_ARG.test(result.contents);

      if (!preexisting) {
        result = mergeContents({
          tag: tag("isprod"),
          src: result.contents,
          newSrc: `
            # https://www.npmjs.com/package/expo-community-flipper
            :production => ENV["PRODUCTION"] == "1" ? true : false,`,
          anchor: IOS_URN_ARG_ANCHOR,
          offset: -1,
          comment: "#",
        });

        // couldn't remove and couldn't add. Treat the operation as failed
        if (!result.didMerge) {
          throw new Error(
            "Cannot add use_flipper to the project's ios/Podfile. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command."
          );
        }
      }

      fs.writeFileSync(filePath, result.contents);

      return c;
    },
  ]);

  return config;
}

/** Add flipper to the podfile, behind an ENV flag */
function withFlipperPodfile(config: ExpoConfig, cfg: FlipperConfig) {
  config = withDangerousMod(config, [
    "ios",
    async (c) => {
      const filePath = path.join(c.modRequest.platformProjectRoot, "Podfile");
      const contents = fs.readFileSync(filePath, "utf-8");
      const flipperPath = getReactNativeFlipperPath(c.modRequest.projectRoot);
      const linked = isFlipperLinked();

      if (!flipperPath || !linked) {
        return c;
      }

      // #3 We cannot tell if a merge failed because of a malformed podfile or it was a noop
      // so instead, remove the content first, then attempt the insert
      let result;

      result = removeTaggedContent(contents, "urn");

      const preexisting = IOS_HAS_FLIPPER_ARG.test(result.contents);

      if (!preexisting) {
        result = mergeContents({
          tag: tag("urn"),
          src: result.contents,
          newSrc: `
            # https://www.npmjs.com/package/expo-community-flipper
            ${createFlipperArgument(cfg.version)}`,
          anchor: IOS_URN_ARG_ANCHOR,
          offset: 1,
          comment: "#",
        });

        // couldn't remove and couldn't add. Treat the operation as failed
        if (!result.didMerge) {
          throw new Error(
            "Cannot add use_flipper to the project's ios/Podfile. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command."
          );
        }
      }

      fs.writeFileSync(filePath, result.contents);

      return c;
    },
  ]);

  return config;
}

export function withFlipperIOS(config: ExpoConfig, cfg: FlipperConfig) {
  config = withEnvProductionPodfile(config);
  config = withFlipperPodfile(config, cfg);
  return config;
}
