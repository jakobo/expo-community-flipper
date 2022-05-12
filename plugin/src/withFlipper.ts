import {
  withDangerousMod,
  withGradleProperties,
  ConfigPlugin,
} from "@expo/config-plugins";
import {
  mergeContents,
  removeContents,
} from "@expo/config-plugins/build/utils/generateCode";
import resolveFrom from "resolve-from";
import path from "path";
import fs from "fs";
import { ExpoConfig } from "@expo/config-types";

const EXPO_FLIPPER_TAG = "expo-community-flipper";
const EXPO_FLIPPER_TAG_POST_INSTALL = "expo-community-flipper-post-install";

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

  // #3 We cannot tell if a merge failed because of a malformed podfile or it was a noop
  // so instead, remove the content first, then attempt the insert
  let removeResult;
  let addResult;

  // remove previous instances for idempotence
  removeResult = removeContents({ src: contents, tag: EXPO_FLIPPER_TAG });
  removeResult = removeContents({
    src: removeResult.contents,
    tag: EXPO_FLIPPER_TAG_POST_INSTALL,
  });

  // insert use_flipper statement
  addResult = mergeContents({
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
    throw new Error(
      "Cannot add use_flipper to the project's ios/Podfile. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command."
    );
  }

  // insert post_install statement inside the post_install loop
  addResult = mergeContents({
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
    throw new Error(
      "Cannot add flipper_post_install to the project's ios/Podfile. Please report this with a copy of your project Podfile. You can generate this with the `expo prebuild` command."
    );
  }

  return addResult.contents;
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
