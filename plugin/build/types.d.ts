import { type ExpoConfig } from "expo/config";
declare type iOSFlipperConfig = {
    enabled: boolean;
    stripUseFrameworks?: boolean;
};
declare type AndroidFlipperConfig = {
    enabled: boolean;
};
export declare type FlipperConfig = {
    version: string | undefined;
    ios: iOSFlipperConfig;
    android: AndroidFlipperConfig;
};
export declare type WithFlipperOptions = FlipperOptions | string;
declare type FlipperOptions = {
    version?: string;
    ios?: boolean | iOSFlipperConfig;
    android?: boolean | AndroidFlipperConfig;
};
export declare type ExpoConfigWithMods = ExpoConfig & {
    mods: Record<"ios" | "android", Record<string, unknown[]>>;
};
export {};
