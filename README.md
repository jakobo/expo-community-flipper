# expo-community-flipper

Flipper Support for Expo Apps

# Usage (Quick Guide)

**1.** Install this module: `yarn add expo-community-flipper`

**2.** Add `expo-community-flipper` configuration to the `plugins` section of your `app.json`, as per the examples below. You have the option to specify the version of Flipper, though the one built in with React Native is (usually) sufficient.

If you don't specify anything, `expo-community-flipper` will default to the version of Flipper bundled with the version of React Native you're currently using.

# Configuration

## Disabling Flipper in CI (>= 45.1.0)

In some scenarios such as CI builds, it may be desirable to disable Flipper to improve build times. `expo-community-flipper` checks `ENV['FLIPPER_DISABLE'] == "1"` to determine if Flipper is disabled. This ENV value can be set in your EAS Secrets, your `app.json`, or your CI environment variables configuration.

In production, Flipper is automatically disabled by the react-native framework.

## Flipper (React Native Default Version)

```json
{
  "expo": {
    "..."
    "plugins": [
      "expo-community-flipper"
    ]
  }
}
```

## Flipper with a specific version

```json
{
  "expo": {
    "..."
    "plugins": [
      ["expo-community-flipper", "0.123.0"]
    ]
  }
}
```

# Windows Users + Hermes

> As of right now, using Windows with the Hermes engine requires you to run your app inside of a WSL environment. [The tracked issue is here](https://github.com/jakobo/expo-community-flipper/issues/4) and if you have a `Podfile`, please let me know. It's likely an upstream issue, but we're continuing to look at build artifacts in case we spot something that may resolve this issue.

# Versions

Starting with Expo SDK 46, Flipper manages its own compatibility layer (though it can be upgraded by specifying a version of Flipper that you want). Prior to SDK 46, we recommended running Flipper @ `0.123.0` as it had the widest range of compatibility with devices and simulators.

This package follows [expo's policy for the deprecation of old SDKs](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/). It's **MAJOR** version tracks against the Expo SDK version, making it easy to spot compatibility differences in your package.json file.

# Testing

An `/example` directory is built with `expo init example` for each major SDK release with a default `eas.json` file. The plugin is directly linked using expo's filepath support for config plugins. You can run `expo prebuild` in the directory to verify the plugin is modifying build files appropriately.

**example eas.json**

```json
{
  "cli": {
    "version": ">= 0.35.0"
  },
  "build": {
    "example": {
      "releaseChannel": "default",
      "channel": "default"
    }
  }
}
```

**example app.json**

```json
{
  "expo": {
    "...": "... standard app.json entries ...",
    "plugins": [["./../build/withFlipper", "0.158.0"]]
  }
}
```

# References

- This code is based on the [Flipper Getting Started Guide](https://fbflipper.com/docs/getting-started/react-native/)
- [Expo Config Plugins](https://docs.expo.dev/guides/config-plugins/)
- [Using the latest Flipper SDK](https://fbflipper.com/docs/getting-started/react-native/#using-the-latest-flipper-sdk)
- [React Native Community's Typescript Template](https://github.com/react-native-community/react-native-template-typescript/tree/main/template)
