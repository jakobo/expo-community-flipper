⚠️ **NOTE** This project's `major` semver matches the supported Expo SDK version. This helps spot inconsistencies between your Expo SDK and this plugin, as well as ensuring any changes to the upstream config-plugins system are properly addressed.

# 46.x.x (Expo SDK 46)

### 46.0.1

**Migration** If you were using individual pod specifications (folly, etc), you can remove all of that now. The Flipper team recommends using only the Flipper version, relying on the pod and maven to pull down the necessary dependencies.

##### 🛠️ Fixes

- Fixes a breaking issue with Podfile generation introduced in react-native 0.69.2 [ref](https://github.com/jakobo/expo-community-flipper/pull/20)
  - Removes the legacy `use_flipper` declaration
  - Removes the `post_install` flipper code
  - Removes the `AppDelegate` code as the RCTAppSetupUtils already exist and this was redundant [ref](https://github.com/expo/expo/blob/d6b89ab435b534bb9bb560d0c1bb15bb0abdfcfa/templates/expo-template-bare-minimum/ios/HelloWorld/AppDelegate.mm#L9)
- Removes individual pod configs as those are no longer encouraged by the FB Flipper Team
- Removed old SDK tests

### 46.0.0

##### 💥 BREAKING CHANGES

- Requires Expo SDK 46, which is now actively checked using [`semver`](https://www.npmjs.com/package/semver) against the config's SDK version. In React Native 0.68+, the `AppDelegate` files are all objective-c++, and there is no `withAppDelegate` support for swift files. The Semver check avoids a footgun of running this plugin with SDK 45 and swift `AppDelegate` files and ending up with non-functional flipper.

**Migration** Please upgrade to the latest Expo SDK. `expo-community-flipper` only maintains versions that are compatible with the supported Expo SDK versions.

##### 🛠️ Fixes

- Modifies `AppDelegate.mm` to enable `RCTAppSetupUtils` per [flipper manual setup](https://fbflipper.com/docs/getting-started/react-native-ios/#react-native-068)

##### 🧹 Chores

- Upgrades Expo SDK requirement to 46

# 45.x.x (Expo SDK 45)

### 45.1.0

- Adds the ability to disable flipper via an ENV variable in EAS / Expo builds `FLIPPER_DISABLE`
- Adds a post install step required by Flipper for native modules

### 45.0.0

- Revised version to match latest Expo SDK. No plugin API changes.

---

# 44.x.x (Expo SDK 44)

### 44.0.2

- (docs) Adds table of compatible flipper versions [ref](https://github.com/jakobo/expo-community-flipper/issues/6)
- (docs) Updates published README urls [ref](https://github.com/jakobo/expo-community-flipper/issues/5)

### 44.0.1

- Resolved idempotency issue with merging flipper into podfiles that contain a use-flipper directive [ref](https://github.com/jakobo/expo-community-flipper/issues/3)
- (chore) Created an example application that can be used for future triage

### 44.0.0

- Revised version to match latest Expo SDK. No plugin API changes.

---

# 43.x.x (Expo SDK 43)

### 43.0.5

- Allows for specifying a universal flipper version as a string argument to the plugin
- `build/` directory is committed for transparency
- Prevents footgun where you could specify Flipper's pods without specifying a Flipper version

### 43.0.1

- Adds support for specifying individual pod versions
