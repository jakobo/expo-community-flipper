# expo-community-flipper

Flipper Support for Expo Apps

> Tested against Expo SDK 43

# Usage (Quick Guide)

**1.** Install the module along with [react-native-flipper](https://www.npmjs.com/package/react-native-flipper): `yarn add expo-community-flipper react-native-flipper`

**2.** Add `expo-community-flipper` configuration to the `plugins` section of your `app.json`, as per the examples below. You have the option to specify the version of Flipper and the pods that you want to use. In React Native, the Android SDK is derived from the main Flipper configuration.

If you don't specify anything, `expo-community-flipper` will default to the version of Flipper bundled with the version of React Native you're currently using.

Not sure what Flipper version you need? [Check the Official Flipper Podfile](https://github.com/facebook/flipper/blob/main/react-native/ReactNativeFlipperExample/ios/Podfile) if you are specifying all of Flipper's pods, or the latest version of [react-native-flipper](https://www.npmjs.com/package/react-native-flipper) if you are just specifying a flipper version.

# Configuration

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

## Flipper with a specific version (since 43.0.5)

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

## Flipper with all Pod dependencies included (since 43.0.1)

_note: Android uses the same version as the primary `Flipper` pod_

```json
{
  "expo": {
    "..."
    "plugins": [
      ["expo-community-flipper", {
        "Flipper": "0.123.0",
        "ios": {
          "Flipper-Folly": "2.6.10",
          "Flipper-RSocket": "1.4.3",
          "Flipper-DoubleConversion": "3.1.7",
          "Flipper-Glog": "0.3.9",
          "Flipper-PeerTalk": "0.0.4"
        }
      }]
    ]
  }
}
```
