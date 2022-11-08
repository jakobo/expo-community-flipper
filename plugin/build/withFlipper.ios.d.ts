import { type FlipperConfig } from "./types";
import { type ExpoConfig } from "expo/config";
/** Given Podfile contents, edit the file via regexes to insert the production flag for hermes if required */
export declare function updatePodfileContentsWithProductionFlag(contents: string): string;
/** Given Podfile contents, edit the file via regexes to insert the flipper arguments */
export declare function updatePodfileContentsWithFlipper(contents: string, cfg: FlipperConfig): string;
export declare function withFlipperIOS(config: ExpoConfig, cfg: FlipperConfig): ExpoConfig;
