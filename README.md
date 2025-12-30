# OBSBOT Webcam SDK Node.js Addon

This repository contains a Node.js native addon for controlling OBSBOT webcams using the official OBSBOT SDK (`v2.1.0_7`). It provides a JavaScript interface to interact with OBSBOT devices for features like gimbal control, zoom, AI tracking, and image settings.

## Architecture

This module provides two API levels:

1.  **High-Level API (Recommended)**: A model-aware API that uses a factory pattern. When you get a list of devices, the module returns instances of specific classes (e.g., `TinyDevice`, `MeetDevice`) that only expose methods supported by that model. This is the safest and easiest way to use the module.

2.  **Low-Level API**: Direct access to the underlying native addon via the `native` property. This exposes a generic `Device` object with all possible methods, regardless of whether the connected device supports them. This is useful for advanced use cases or debugging.

## Prerequisites

Before building this module, you need to have the following installed on your system:

*   [Node.js](https://nodejs.org/) and npm
*   `node-gyp` and its dependencies:
    *   A C++ compiler toolchain (GCC on Linux, Xcode Command Line Tools on macOS, or Visual Studio with C++ workload on Windows).
    *   Python (v3.x).

`node-gyp` is listed as a dev dependency and will be installed locally, but its system-wide prerequisites must be met. Please refer to the [`node-gyp` installation guide](https://github.com/nodejs/node-gyp#installation) for detailed instructions for your operating system.

## Installation and Building

Clone the repository and install the dependencies. The `install` script will automatically build the native addon.

```bash
# Clone the repository
git clone <repository-url>
cd obsbot-sdk

# Install dependencies and build the addon
npm install
```

If you make changes to the C++ source code (`src/main.cpp`), you can rebuild the addon manually:

```bash
npm run build
```

The compiled native addon will be located at `build/Release/obsbot_native.node`.

## Basic Usage (High-Level API)

```javascript
// index.js
const obsbot = require('./index'); // Or require('obsbot-sdk') if installed

console.log('Initializing OBSBOT SDK...');
// Initialize the SDK. This must be called before any other function.
const initResult = obsbot.initSDK();
if (initResult !== 0) {
    console.error('Failed to initialize SDK, error code:', initResult);
    return;
}

// Register a callback to be notified when a device is connected or disconnected.
obsbot.setDevChangedCallback((sn, attached) => {
    console.log(`\n--- Device Event ---`);
    console.log(`Device SN: ${sn}, Status: ${attached ? 'Connected' : 'Disconnected'}`);
    console.log(`--------------------\n`);
    // Refresh the device list after a change.
    listDevices();
});

function listDevices() {
    const devices = obsbot.getDevList();
    console.log(`Found ${devices.length} device(s):`);

    devices.forEach(device => {
        console.log(`- SN: ${device.getSn()}, Name: ${device.getName()}`);
        // Check the device type to access model-specific features
        if (device instanceof obsbot.TinyDevice) {
            console.log('  This is a Tiny device. It supports AI tracking.');
        } else if (device instanceof obsbot.MeetDevice) {
            console.log('  This is a Meet device. It supports virtual backgrounds.');
        }
    });
}

// Perform an initial scan for devices.
console.log('Performing initial device scan...');
listDevices();


// Keep the script running to listen for device changes.
// The SDK must be de-initialized on exit to release resources.
console.log('\nWatching for device changes... Press Ctrl+C to exit.');
process.on('SIGINT', () => {
    console.log('\nDe-initializing SDK...');
    obsbot.deinitSDK();
    process.exit(0);
});
```

## API Reference

### Top-Level Module Exports

*   `initSDK()`: Initializes the SDK. Must be called first. Returns `0` on success.
*   `deinitSDK()`: De-initializes the SDK and releases all resources. Should be called when your application exits.
*   `getDevList()`: Returns an array of model-specific device instances (e.g., `TinyDevice`, `MeetDevice`).
*   `setDevChangedCallback(callback)`: Registers a function to be called when a device is connected or disconnected.
    *   `callback(sn, attached)`:
        *   `sn` (string): The serial number of the device.
        *   `attached` (boolean): `true` if connected, `false` if disconnected.
*   `native`: The raw low-level native addon object.
*   `ObsbotProductType`: An enum of all known product type IDs.
*   `BaseDevice`, `TinyDevice`, `MeetDevice`: The JavaScript wrapper classes.

### `BaseDevice` Class (Common to all devices)

#### Device Information
*   `getSn()`: Returns the serial number (string).
*   `getName()`: Returns the product name (string).
*   `getProductType()`: Returns the product type identifier (number).
*   `getVideoDevPath()`: Returns the system path for the video device (e.g., `/dev/video0` on Linux). Essential for capturing video.
*   `getAudioDevPath()`: Returns the system path for the audio device.
*   `getCapabilities()`: Returns an object containing the supported value ranges for various settings (e.g., `{ zoom: { min, max, default, step }, ... }`). This is useful for building dynamic UI controls.

#### Gimbal Control
*   `gimbalReset()`: Resets the gimbal to its default position.
*   `gimbalMove(pitch, pan)`: Moves the gimbal at a given speed.
    *   `pitch` (number): Speed on the pitch axis (-90 to 90).
    *   `pan` (number): Speed on the pan axis (-180 to 180).

#### Zoom Control
*   `setZoom(zoom)`: Sets the absolute digital zoom level.
    *   `zoom` (number): Zoom value (e.g., 1.0 to 4.0, depending on the device).
*   `getZoom()`: Returns the current absolute zoom level (e.g., 1.0 to 4.0, depending on the device).
*   `getZoomRange()`: Returns an object `{ min, max, default }` for zoom.

#### Image & Video Settings
*   `setHDR(enable)`: Enables or disables High Dynamic Range (HDR).
*   `setImageSetting(setting, value)`: Sets a specific image property (`"brightness"`, `"contrast"`, `"saturation"`, `"sharpness"`, `"hue"`).
*   `getImageSetting(setting)`: Gets the current value of a specific image property.

### `TinyDevice` Class

Inherits from `BaseDevice` and adds the following methods.

*   **Enums**: `TinyDevice.AiWorkMode`, `TinyDevice.AiSubModeHuman`, `TinyDevice.AiVerticalTrackType`.

#### AI Control
*   `getAiStatus()`: Returns an object with the current AI status, e.g., `{ gesture_target: true, main_mode: 1 }`.
*   `setAiTrackingMode(mode)`: Sets the AI vertical tracking mode (for Tiny series). (e.g., `TinyDevice.AiVerticalTrackType.Headroom`).
*   `setAiMode(mode, [sub_mode])`: Sets the main AI working mode (e.g., `TinyDevice.AiWorkMode.Human`, `TinyDevice.AiSubModeHuman.UpperBody`).
*   `toggleGestureTarget(enable)`: Enables or disables gesture target selection.
*   `toggleGestureZoom(enable)`: Enables or disables gesture zoom.
*   `toggleGestureDynamicZoom(enable)`: Enables or disables dynamic gesture zoom.
*   `toggleGestureMirror(enable)`: Enables or disables gesture mirroring.

#### Preset Management
*   `getPresetList()`: Returns an array of saved preset IDs.
*   `goToPreset(id)`: Moves the gimbal to the specified preset position.
*   `addPreset(id)`: Saves the current gimbal position as a new preset.
*   `deletePreset(id)`: Deletes the specified preset.

### `MeetDevice` Class

Inherits from `BaseDevice` and adds the following methods.

*   **Enums**: `MeetDevice.MediaMode`, `MeetDevice.BackgroundMode`, `MeetDevice.BackgroundColor`, `MeetDevice.AutoFramingMode`, `MeetDevice.AutoFramingSingleMode`.

#### Media & Framing Control
*   `setMediaMode(mode)`: Sets the camera's main media mode (e.g., `MeetDevice.MediaMode.AutoFrame`).
*   `setAutoFramingMode(groupSingleMode, closeUpperMode)`: Configures the auto-framing behavior.
*   `setBackgroundMode(mode)`: Sets the virtual background effect (e.g., `MeetDevice.BackgroundMode.Blur`).
*   `setBackgroundColor(color)`: Sets the color for the color-key background.
*   `setBlurLevel(level)`: Sets the intensity of the background blur (0-100).
*   `selectBackgroundImage(index)`: Selects a custom background image.
*   `deleteBackgroundImage(index)`: Deletes a custom background image.
*   `toggleGestureZoom(enable)`: Enables or disables gesture zoom.

## Advanced Usage Examples

### Example 1: Use `MeetDevice` Features

```javascript
const obsbot = require('./index');
obsbot.initSDK(); // use obsbot.initSDK(true); to get debug logs

const devices = obsbot.getDevList();
const meetDevice = devices.find(d => d instanceof obsbot.MeetDevice);

if (meetDevice) {
    console.log('Found a Meet device. Enabling background blur.');
    // Set media mode to virtual background
    meetDevice.setMediaMode(obsbot.MeetDevice.MediaMode.Background);
    // Set the background effect to blur
    meetDevice.setBackgroundMode(obsbot.MeetDevice.BackgroundMode.Blur);
    // Set blur intensity to 50%
    meetDevice.setBlurLevel(50);
}
```

### Example 2: Check Device Capabilities

```javascript
const devices = obsbot.getDevList();
if (devices.length > 0) {
    const myDevice = devices[0];
    const capabilities = myDevice.getCapabilities();

    console.log('Device Capabilities:', capabilities);

    if (capabilities.brightness) {
        console.log(`Brightness range: ${capabilities.brightness.min} to ${capabilities.brightness.max}`);
    }
    if (capabilities.zoom) {
        // Note: Zoom values from capabilities are often scaled (e.g., 100 = 1.0x)
        console.log(`Zoom range: ${capabilities.zoom.min / 100}x to ${capabilities.zoom.max / 100}x`);
    }
}
```

### Example 3: Use the Low-Level Native API

This is for advanced cases where you want to bypass the high-level wrappers.

```javascript
const obsbot = require('./index');
obsbot.native.initSDK();

// getDevList() from the native module returns raw device objects
const nativeDevices = obsbot.native.getDevList();
if (nativeDevices.length > 0) {
    const nativeDevice = nativeDevices[0];
    // You can call any method directly, even if the device doesn't support it.
    // This may result in errors or unexpected behavior.
    const sn = nativeDevice.getSn();
    console.log(`Got SN from native device: ${sn}`);
}
```

## License
The original OBSBOT SDK is proprietary software provided by OBSBOT, and this module is a third-party wrapper around that SDK.
This SDK wrapper is open source and licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

## Support this project

If you find this SDK useful, please consider supporting the project:

- **Star the repository**: Give us a star on GitHub to show your support.
- **Contribute**: Check out the [contributing guidelines](CONTRIBUTING.md) to see how you can help.
- **Donate**: If you'd like to financially support the development, consider making a donation. If you want more devices to be tested, you can also offer or lend an OBSBOT device for testing new features, as I only own a Tiny SE myself.
- **Report issues**: If you encounter any bugs or have feature requests, please open an issue on GitHub.

Thank you for your support!