import type { GestureControl, ImageSetting, NativeDevice } from "../src/types.ts"

export class BaseDevice {
	_native: NativeDevice
	constructor(nativeDevice: NativeDevice) {
		this._native = nativeDevice
	}

	// --- Device Information ---
	getSn() {
		return this._native.getSn()
	}

	getName() {
		return this._native.getName()
	}

	getProductType() {
		return this._native.getProductType()
	}

	getVideoDevPath() {
		return this._native.getVideoDevPath()
	}

	getAudioDevPath() {
		return this._native.getAudioDevPath()
	}

	// --- Gimbal Control ---
	gimbalReset() {
		return this._native.gimbalReset()
	}

	gimbalMove(pitch: number, pan: number) {
		return this._native.gimbalMove(pitch, pan)
	}

	// --- Zoom Control ---
	setZoom(zoom: number) {
		return this._native.setZoom(zoom)
	}

	getZoom() {
		return this._native.getZoom()
	}

	getZoomRange() {
		return this._native.getZoomRange()
	}

	// --- Image & Video Settings ---
	setHDR(enable: boolean) {
		return this._native.setHDR(enable)
	}

	setImageSetting(setting: ImageSetting, value: number) {
		return this._native.setImageSetting(setting, value)
	}

	getImageSetting(setting: ImageSetting) {
		return this._native.getImageSetting(setting)
	}

	/**
	 * Gets the supported value ranges for various device settings.
	 * @returns {object} An object containing the capabilities, e.g.,
	 * {
	 *   zoom: { min: 100, max: 400, default: 100, step: 1 },
	 *   brightness: { min: 0, max: 100, default: 50, step: 1 },
	 *   ...
	 * }
	 */
	getCapabilities() {
		// @ts-ignore
		return this._native.getCapabilities()
	}

	// --- Internal/Advanced Methods ---
	_setGestureControl(gesture: GestureControl, enable: boolean) {
		return this._native.setGestureControl(gesture, enable)
	}
}