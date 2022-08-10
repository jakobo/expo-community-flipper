# 46.x.x (Expo SDK 46)

#### 46.0.0

- Revised version to match latest Expo SDK. No plugin API changes.

# 45.x.x (Expo SDK 45)

#### 45.1.0

- Adds the ability to disable flipper via an ENV variable in EAS / Expo builds `FLIPPER_DISABLE`
- Adds a post install step required by Flipper for native modules

#### 45.0.0

- Revised version to match latest Expo SDK. No plugin API changes.

---

# 44.x.x (Expo SDK 44)

#### 44.0.2

- (docs) Adds table of compatible flipper versions [ref](https://github.com/jakobo/expo-community-flipper/issues/6)
- (docs) Updates published README urls [ref](https://github.com/jakobo/expo-community-flipper/issues/5)

#### 44.0.1

- Resolved idempotency issue with merging flipper into podfiles that contain a use-flipper directive [ref](https://github.com/jakobo/expo-community-flipper/issues/3)
- (chore) Created an example application that can be used for future triage

#### 44.0.0

- Revised version to match latest Expo SDK. No plugin API changes.

---

# 43.x.x (Expo SDK 43)

#### 43.0.5

- Allows for specifying a universal flipper version as a string argument to the plugin
- `build/` directory is committed for transparency
- Prevents footgun where you could specify Flipper's pods without specifying a Flipper version

#### 43.0.1

- Adds support for specifying individual pod versions
