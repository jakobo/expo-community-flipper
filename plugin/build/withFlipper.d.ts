import { ConfigPlugin } from "@expo/config-plugins";
export declare type withFlipperOptions = flipperOptions | string;
declare type flipperOptions = {
    Flipper?: string;
    ios?: {
        "Flipper-Folly": string;
        "Flipper-RSocket": string;
        "Flipper-DoubleConversion": string;
        "Flipper-Glog": string;
        "Flipper-PeerTalk": string;
    };
};
export declare type flipperConfig = {
    ios: {
        [key: string]: string | null;
        Flipper: string | null;
    };
    android: string | null;
};
/** Adds the flipper lines to the podfile */
export declare function addFlipperToPodfile(contents: string, options: flipperConfig): string;
/** Enable flipper on this application */
export declare const withFlipper: ConfigPlugin<withFlipperOptions>;
export default withFlipper;
