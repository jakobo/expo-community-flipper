import {
  withDangerousMod,
  withGradleProperties,
  ConfigPlugin,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import resolveFrom from "resolve-from";
import path from "path";
import fs from "fs";
import { ExpoConfig } from "@expo/config-types";

export type withFlipperOptions = flipperOptions | string;

type flipperOptions = {
  Flipper?: string;
  ios?: supportedPods;
};

type supportedPods = {
  "Flipper-Folly": string;
  "Flipper-RSocket": string;
  "Flipper-DoubleConversion": string;
  "Flipper-Glog": string;
  "Flipper-PeerTalk": string;
};

async function getReactNativeFlipperPath(
  projectRoot: string
): Promise<string | null> {
  const resolved = resolveFrom.silent(
    projectRoot,
    "react-native-flipper/package.json"
  );
  return resolved ? path.dirname(resolved) : null;
}

async function isFlipperLinked(): Promise<boolean> {
  // TODO: Autolink detection when supported
  return true;
}

export function addFlipperToPodfile(
  contents: string,
  options?: withFlipperOptions
) {
  let flipperVersion: string | null = null;
  let iosPods: supportedPods | null = null;

  if (typeof options === "string") {
    flipperVersion = options;
  } else if (typeof options === "object" && options.ios) {
    flipperVersion = options.Flipper || null;
    iosPods = options.ios;
  }

  const flipperVersions: string[] = [];

  if (flipperVersion) {
    flipperVersions.push(`'Flipper' => '${flipperVersion}'`);
    if (iosPods) {
      for (const pod of Object.getOwnPropertyNames(iosPods)) {
        flipperVersions.push(
          `'${pod}' => '${iosPods[pod as keyof supportedPods]}'`
        );
      }
    }
  }

  // https://react-native-community.github.io/upgrade-helper/?from=0.63.0&to=0.64.2
  // https://github.com/expo/expo/tree/master/templates/expo-template-bare-minimum/
  const versionString = flipperVersions.length
    ? `{${flipperVersions.join(", ")}}`
    : "";
  const enableFlipper = mergeContents({
    tag: "flipper",
    src: contents,
    newSrc: `  use_flipper!(${versionString})`,
    anchor: /# Uncomment to opt-in to using Flipper/,
    offset: 0,
    comment: "#",
  });

  if (!enableFlipper.didMerge) {
    throw new Error(
      "Cannot add Flipper to the project's ios/Podfile because it's malformed. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command."
    );
  }

  return enableFlipper.contents;
}

function withIosFlipper(config: ExpoConfig, options: withFlipperOptions) {
  return withDangerousMod(config, [
    "ios",
    async (c) => {
      const filePath = path.join(c.modRequest.platformProjectRoot, "Podfile");
      const contents = fs.readFileSync(filePath, "utf-8");
      const flipperPath = await getReactNativeFlipperPath(
        c.modRequest.projectRoot
      );
      const linked = isFlipperLinked();

      if (!flipperPath || !linked) {
        return c;
      }

      const results = addFlipperToPodfile(contents, options);
      fs.writeFileSync(filePath, results);

      return c;
    },
  ]);
}

function withAndroidFlipper(config: ExpoConfig, options: withFlipperOptions) {
  let flipperVersion: string | null = null;

  if (typeof options === "string") {
    flipperVersion = options;
  } else if (typeof options === "object" && options.ios) {
    flipperVersion = options.Flipper || null;
  }

  const flipperKey = "FLIPPER_VERSION";
  return withGradleProperties(config, (c) => {
    if (flipperVersion) {
      // strip flipper key and re-add
      c.modResults = c.modResults.filter(
        (item) => !(item.type === "property" && item.key === flipperKey)
      );
      c.modResults.push({
        type: "property",
        key: flipperKey,
        value: flipperVersion,
      });
    }

    return c;
  });
}

export const withFlipper: ConfigPlugin<withFlipperOptions> = (
  config,
  options
) => {
  config = withIosFlipper(config, options);
  config = withAndroidFlipper(config, options);
  return config;
};

export default withFlipper;
