import { addFlipperToPodfile, flipperConfig } from "../withFlipper";
import fs from "fs";
import path from "path";

const fixtures = {
  sdk43: {
    ios: {
      Podfile: fs.readFileSync(
        path.resolve(__dirname, "./__fixtures__/sdk43/ios/Podfile"),
        "utf-8"
      ),
    },
    android: {
      "gradle.properties": fs.readFileSync(
        path.resolve(
          __dirname,
          "./__fixtures__/sdk43/android/gradle.properties"
        ),
        "utf-8"
      ),
    },
  },
};

const flipperNoVersions: flipperConfig = {
  ios: {
    Flipper: null,
  },
  android: null,
};

const flipperWithVersion: flipperConfig = {
  ios: {
    Flipper: "0.123.0",
  },
  android: "0.123.0",
};

const flipperWithAllVersions: flipperConfig = {
  ios: {
    Flipper: "0.123.0",
    "Flipper-Folly": "2.6.10",
    "Flipper-RSocket": "1.4.3",
    "Flipper-DoubleConversion": "3.1.7",
    "Flipper-Glog": "0.3.9",
    "Flipper-PeerTalk": "0.0.4",
  },
  android: "0.123.0",
};

const flipperMissingMainVersion: flipperConfig = {
  ios: {
    Flipper: null,
    "Flipper-Folly": "2.6.10",
    "Flipper-RSocket": "1.4.3",
    "Flipper-DoubleConversion": "3.1.7",
    "Flipper-Glog": "0.3.9",
    "Flipper-PeerTalk": "0.0.4",
  },
  android: null,
};

describe("addFlipperToPodfile sdk43", () => {
  it("modifies the Podfile", () => {
    expect(
      addFlipperToPodfile(fixtures.sdk43.ios.Podfile, flipperNoVersions)
    ).toMatchSnapshot();
  });

  it("modifies the Podfile with only a Flipper version", () => {
    expect(
      addFlipperToPodfile(fixtures.sdk43.ios.Podfile, flipperWithVersion)
    ).toMatchSnapshot();
  });

  it("modifies the Podfile with specified Flipper versions", () => {
    expect(
      addFlipperToPodfile(fixtures.sdk43.ios.Podfile, flipperWithAllVersions)
    ).toMatchSnapshot();
  });

  it("won't let you use a Flipper sub-pod without Flipper defined", () => {
    expect(() =>
      addFlipperToPodfile(fixtures.sdk43.ios.Podfile, flipperMissingMainVersion)
    ).toThrow();
  });
});
