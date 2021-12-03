# expo-community-flipper

Flipper Support for Expo Apps

> Tested against Expo SDK 43

# Usage (Quick Guide)

**1.** Install the module along with `react-native-flipper`
`yarn add jakobo/expo-community-flipper react-native-flipper`

**2.** Add the plugin to your `plugins` section of your `app.json`, and optionally specify the version of Flipper and the pods that you want. In React-Native, the Android SDK is derrived from the main Flipper configuration.

If you don't specify anything, `expo-community-flipper` will default to the version of Flipper bundled with the version of React Native you're currently using.

Not sure what Flipper version you need? [Check the Official Flipper Podfile](https://github.com/facebook/flipper/blob/main/react-native/ReactNativeFlipperExample/ios/Podfile)

**Just Flipper**

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

**Alternate Config: With All Options**

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
