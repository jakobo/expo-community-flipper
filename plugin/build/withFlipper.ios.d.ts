import { ExpoConfig } from "@expo/config-types";
import { FlipperConfig } from "./types";
export declare function withFlipperIOS(config: ExpoConfig, cfg: FlipperConfig): ExpoConfig;
export declare function updatePodfileContents(contents: string, cfg: FlipperConfig): string;
