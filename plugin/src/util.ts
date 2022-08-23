import resolveFrom from "resolve-from";
import path from "path";
import fs from "fs";
import type { PackageJson } from "type-fest";
import { FlipperConfig, WithFlipperOptions } from "./types";

/** Gets the native flipper path */
export function getReactNativeFlipperPath(
  projectRoot: string
): string | undefined {
  const resolved = resolveFrom.silent(
    projectRoot,
    "react-native-flipper/package.json"
  );
  return resolved ? path.dirname(resolved) : undefined;
}

export function getConfiguration(options?: WithFlipperOptions): FlipperConfig {
  let flipperVersion: string | undefined;

  if (typeof options === "string") {
    flipperVersion = options;
  } else if (typeof options === "object") {
    if (options.version) {
      flipperVersion = options.version;
    }
  }

  return {
    version: flipperVersion,
  };
}
