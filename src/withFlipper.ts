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
  ios?: {
    "Flipper-Folly": string;
    "Flipper-RSocket": string;
    "Flipper-DoubleConversion": string;
    "Flipper-Glog": string;
    "Flipper-PeerTalk": string;
  };
};

export type flipperConfig = {
  ios: {
    [key: string]: string | null;
    Flipper: string | null;
  };
  android: string | null;
};

function getConfiguration(options?: withFlipperOptions): flipperConfig {
  let flipperVersion: string | null = null;
  let iosPods: { [key: string]: string } = {};

  if (typeof options === "string") {
    flipperVersion = options;
  } else if (typeof options === "object") {
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

export function addFlipperToPodfile(contents: string, options: flipperConfig) {
  // all flipper pods. Flipper must go first
  const flipperVersions: string[] = [];
  const { Flipper, ...rest } = options.ios;
  if (Object.getOwnPropertyNames(rest).length > 0 && !Flipper) {
    throw new Error(
      "You cannot specify additional pods for Flipper without also specifying Flipper"
    );
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

function withIosFlipper(config: ExpoConfig, options: flipperConfig) {
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

function withAndroidFlipper(config: ExpoConfig, options: flipperConfig) {
  const flipperKey = "FLIPPER_VERSION";
  return withGradleProperties(config, (c) => {
    if (options.android) {
      // strip flipper key and re-add
      c.modResults = c.modResults.filter(
        (item) => !(item.type === "property" && item.key === flipperKey)
      );
      c.modResults.push({
        type: "property",
        key: flipperKey,
        value: options.android,
      });
    }

    return c;
  });
}

export const withFlipper: ConfigPlugin<withFlipperOptions> = (
  config,
  options
) => {
  const opts = getConfiguration(options);
  config = withIosFlipper(config, opts);
  config = withAndroidFlipper(config, opts);
  return config;
};

export default withFlipper;
