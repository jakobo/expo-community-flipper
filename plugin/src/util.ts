import { FlipperConfig, WithFlipperOptions } from "./types";

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
