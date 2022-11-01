import { type FlipperConfig } from "./types";
import { type ExpoConfig } from "expo/config";
export declare function withFlipperIOS(config: ExpoConfig, cfg: FlipperConfig): ExpoConfig;
export declare function updatePodfileContents(contents: string, cfg: FlipperConfig): string;
