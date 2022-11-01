import { updatePodfileContents } from "../withFlipper.ios";

describe(updatePodfileContents, () => {
  it("should update expo sdk 46 podfile", () => {
    const contents = `
  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => flags[:hermes_enabled] || podfile_properties['expo.jsEngine'] == 'hermes',
    :fabric_enabled => flags[:fabric_enabled],
    # An absolute path to your application root.
    :app_path => "#{Dir.pwd}/.."
  )`;
    expect(
      updatePodfileContents(contents, {
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
      # @generated begin expo-community-flipper-urn - expo prebuild (DO NOT MODIFY) sync-0d6c393415c155009dbe3271effb1563fab482d2
          # Flipper arguments generated from app.json
          :flipper_configuration => ENV['FLIPPER_DISABLE'] == "1" ? FlipperConfiguration.disabled : FlipperConfiguration.enabled(["Debug"], { 'Flipper' => '0.999.0' }),
      # @generated end expo-community-flipper-urn
          # An absolute path to your application root.
          :app_path => "#{Dir.pwd}/.."
        )"
    `);
  });

  it("should update expo sdk 47 podfile", () => {
    const contents = `
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
    expect(
      updatePodfileContents(contents, {
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
      # @generated begin expo-community-flipper-urn - expo prebuild (DO NOT MODIFY) sync-0d6c393415c155009dbe3271effb1563fab482d2
          # Flipper arguments generated from app.json
          :flipper_configuration => ENV['FLIPPER_DISABLE'] == "1" ? FlipperConfiguration.disabled : FlipperConfiguration.enabled(["Debug"], { 'Flipper' => '0.999.0' }),
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
