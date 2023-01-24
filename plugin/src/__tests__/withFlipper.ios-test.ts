import { type ExpoConfig } from "expo/config";
import {
  updatePodfileContentsWithFlipper,
  updatePodfileContentsWithProductionFlag,
} from "../withFlipper.ios";
import { withFlipper } from "../withFlipper";
import { ExpoConfigWithMods } from "../types";

const PODFILE_SDK46 = `
  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => flags[:hermes_enabled] || podfile_properties['expo.jsEngine'] == 'hermes',
    :fabric_enabled => flags[:fabric_enabled],
    # An absolute path to your application root.
    :app_path => "#{Dir.pwd}/.."
  )`;

const PODFILE_SDK47 = `
  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => podfile_properties['expo.jsEngine'] == 'hermes',
    :fabric_enabled => flags[:fabric_enabled],
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/..",
    #
    # Uncomment to opt-in to using Flipper
    # Note that if you have use_frameworks! enabled, Flipper will not work
    # :flipper_configuration => !ENV['CI'] ? FlipperConfiguration.enabled : FlipperConfiguration.disabled,
  )`;

describe(withFlipper, () => {
  it("SDK47 - should leave podfile alone on ios.enabeld=false", () => {
    const ecf = {
      version: "0.999.0",
      ios: { enabled: false },
      android: { enabled: true },
    };
    const config: ExpoConfig = {
      name: "sdk47-disable",
      slug: "sdk47-disable",
      plugins: [["../withFlipper", ecf]],
    };
    withFlipper(config, ecf);
    expect((config as ExpoConfigWithMods).mods.ios).toBeUndefined();
  });
});

describe(updatePodfileContentsWithProductionFlag, () => {
  it("SDK46 - should add production flag to podfile", () => {
    expect(updatePodfileContentsWithProductionFlag(PODFILE_SDK46))
      .toMatchInlineSnapshot(`
      "
        use_react_native!(
          :path => config[:reactNativePath],
      # @generated begin expo-community-flipper-isprod - expo prebuild (DO NOT MODIFY) sync-828c22a1a38236bf5b7c203393f474bc68356b34
          # ENV value added to support Hermes
          :production => ENV["PRODUCTION"] == "1" ? true : false,
      # @generated end expo-community-flipper-isprod
          :hermes_enabled => flags[:hermes_enabled] || podfile_properties['expo.jsEngine'] == 'hermes',
          :fabric_enabled => flags[:fabric_enabled],
          # An absolute path to your application root.
          :app_path => "#{Dir.pwd}/.."
        )"
    `);
  });

  it("SDK47 - should add production flag to podfile", () => {
    expect(updatePodfileContentsWithProductionFlag(PODFILE_SDK47))
      .toMatchInlineSnapshot(`
      "
        use_react_native!(
          :path => config[:reactNativePath],
      # @generated begin expo-community-flipper-isprod - expo prebuild (DO NOT MODIFY) sync-828c22a1a38236bf5b7c203393f474bc68356b34
          # ENV value added to support Hermes
          :production => ENV["PRODUCTION"] == "1" ? true : false,
      # @generated end expo-community-flipper-isprod
          :hermes_enabled => podfile_properties['expo.jsEngine'] == 'hermes',
          :fabric_enabled => flags[:fabric_enabled],
          # An absolute path to your application root.
          :app_path => "#{Pod::Config.instance.installation_root}/..",
          #
          # Uncomment to opt-in to using Flipper
          # Note that if you have use_frameworks! enabled, Flipper will not work
          # :flipper_configuration => !ENV['CI'] ? FlipperConfiguration.enabled : FlipperConfiguration.disabled,
        )"
    `);
  });
});

describe(updatePodfileContentsWithFlipper, () => {
  it("SDK46 - should add flipper configuration to podfile", () => {
    expect(
      updatePodfileContentsWithFlipper(PODFILE_SDK46, {
        version: "0.999.0",
        ios: { enabled: true },
        android: { enabled: true },
      })
    ).toMatchInlineSnapshot(`
      "
        use_react_native!(
          :path => config[:reactNativePath],
          :hermes_enabled => flags[:hermes_enabled] || podfile_properties['expo.jsEngine'] == 'hermes',
          :fabric_enabled => flags[:fabric_enabled],
      # @generated begin expo-community-flipper-urn - expo prebuild (DO NOT MODIFY) sync-c4e29a0d8d26d89d18d83e849fad0d0cec9ab064
          :flipper_configuration => FlipperConfiguration.enabled(["Debug", "Dev.Debug", "Release"], { 'Flipper' => '0.999.0' }),
      # @generated end expo-community-flipper-urn
          # An absolute path to your application root.
          :app_path => "#{Dir.pwd}/.."
        )"
    `);
  });

  it("SDK47 - should add flipper configuration to podfile", () => {
    expect(
      updatePodfileContentsWithFlipper(PODFILE_SDK47, {
        version: "0.999.0",
        ios: { enabled: true },
        android: { enabled: true },
      })
    ).toMatchInlineSnapshot(`
      "
        use_react_native!(
          :path => config[:reactNativePath],
          :hermes_enabled => podfile_properties['expo.jsEngine'] == 'hermes',
          :fabric_enabled => flags[:fabric_enabled],
      # @generated begin expo-community-flipper-urn - expo prebuild (DO NOT MODIFY) sync-c4e29a0d8d26d89d18d83e849fad0d0cec9ab064
          :flipper_configuration => FlipperConfiguration.enabled(["Debug", "Dev.Debug", "Release"], { 'Flipper' => '0.999.0' }),
      # @generated end expo-community-flipper-urn
          # An absolute path to your application root.
          :app_path => "#{Pod::Config.instance.installation_root}/..",
          #
          # Uncomment to opt-in to using Flipper
          # Note that if you have use_frameworks! enabled, Flipper will not work
          # :flipper_configuration => !ENV['CI'] ? FlipperConfiguration.enabled : FlipperConfiguration.disabled,
        )"
    `);
  });
});
