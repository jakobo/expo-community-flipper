# 44.x.x (Expo SDK 44)

- `next`

  - Resolved idempotency issue with merging flipper into podfiles

- `44.0.0`
  - Revised version to match latest Expo SDK. No plugin API changes.

# 43.x.x (Expo SDK 43)

- `43.0.5`
  - Allows for specifying a universal flipper version as a string argument to the plugin
  - `build/` directory is committed for transparency
  - Prevents footgun where you could specify Flipper's pods without specifying a Flipper version
- `43.0.1`
  - Adds support for specifying individual pod versions
