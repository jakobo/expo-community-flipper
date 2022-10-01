"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFlipper = void 0;
const util_1 = require("./util");
const withFlipper_ios_1 = require("./withFlipper.ios");
const withFlipper_android_1 = require("./withFlipper.android");
/** Enable flipper on this application */
const withFlipper = (config, options) => {
    const opts = (0, util_1.getConfiguration)(options);
    if (opts.ios.enabled) {
        config = (0, withFlipper_ios_1.withFlipperIOS)(config, opts);
    }
    if (opts.android.enabled) {
        config = (0, withFlipper_android_1.withFlipperAndroid)(config, opts);
    }
    return config;
};
exports.withFlipper = withFlipper;
exports.default = exports.withFlipper;
