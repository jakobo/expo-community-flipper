# expo-community-flipper
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Flipper Support for Expo Apps

> ⚠️ Please see [this issue](https://github.com/jakobo/expo-community-flipper/issues/27) about known compatibility issues with other plugins.

# Usage (Quick Guide)

**1.** Install this module: `yarn add expo-community-flipper`

**2.** Add `expo-community-flipper` configuration to the `plugins` section of your `app.json`, as per the examples below. You have the option to specify the version of Flipper, though the one built in with React Native is (usually) sufficient.

If you don't specify anything, `expo-community-flipper` will default to the version of Flipper bundled with the version of React Native you're currently using.

# Configuration

```ts
type FlipperOptions =
  | undefined // take the default options for the entire plugin
  | string // sets <root>.version and takes defaults for all nested options
  | {
      version?: string; // sets the flipper version to build against (defaults to undefined, uses react-native bundled version)
      ios?:
        | boolean // sets <root>.ios.enabled and takes defaults for all nested options
        | {
            enabled: boolean; // enable flipper for iOS (default true)
            stripUseFrameworks?: boolean; // strip instances of use_frameworks from the Podfile (default false)
          };
      android?:
        | boolean // sets <root>.ios.enabled and takes defaults for all nested options
        | {
            enabled: boolean; // enable flipper for Android (default true)
          };
    };
```

Configuration of this plugin is done in `app.json`. all configurations are optional with defaults designed to minimize the chances of your build breaking.

```json
{
  "expo": {
    "..."
    "plugins": [
      "expo-community-flipper"
    ]
  }
}

// or configured (See FlipperOptions above):

{
  "expo": {
    "..."
    "plugins": [
      ["expo-community-flipper", FlipperOptions]
    ]
  }
}
```

## Disabling Flipper in CI (>= 45.1.0)

In some scenarios such as CI builds, it may be desirable to disable Flipper to improve build times. `expo-community-flipper` checks `ENV['FLIPPER_DISABLE'] == "1"` to determine if Flipper is disabled. This ENV value can be set in your EAS Secrets, your `app.json`, or your CI environment variables configuration.

In production, Flipper is automatically disabled by the react-native framework.

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://codedrift.com"><img src="https://avatars.githubusercontent.com/u/1795?v=4?s=100" width="100px;" alt="Jakob Heuser"/><br /><sub><b>Jakob Heuser</b></sub></a><br /><a href="https://github.com/jakobo/expo-community-flipper/commits?author=jakobo" title="Code">💻</a></td>
    </tr>
  </tbody>
  <tfoot>
    
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!