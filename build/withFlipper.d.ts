import { ConfigPlugin } from "@expo/config-plugins";
export declare type withFlipperOptions = flipperOptions | string;
declare type flipperOptions = {
    Flipper?: string;
    ios?: supportedPods;
};
declare type supportedPods = {
    "Flipper-Folly": string;
    "Flipper-RSocket": string;
    "Flipper-DoubleConversion": string;
    "Flipper-Glog": string;
    "Flipper-PeerTalk": string;
};
export declare function addFlipperToPodfile(contents: string, options?: withFlipperOptions): string;
export declare const withFlipper: ConfigPlugin<withFlipperOptions>;
export default withFlipper;
