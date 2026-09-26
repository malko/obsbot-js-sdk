import type { GestureControl, ImageSetting, NativeDevice } from "../src/types.ts"


export const ObsbotProductTypeName:Record<number, string> = {
    0: "Tiny",
    1: "Tiny 4k",
    2: "Tiny 2",
    3: "Tiny 2 Lite",
    4: "Tail Air",
    5: "Meet",
    6: "Meet 4k",
    7: "Me",
    8: "HDMI Box",
    9: "NDI Box",
    10: "Meet 2",
    11: "Tail 2",
    12: "Tiny SE",
    13: "Meet SE",
    16: "Tail 2S",
}

export class BaseDevice {
	_native: NativeDevice
	constructor(nativeDevice: NativeDevice) {
		this._native = nativeDevice
	}

	// --- Device Information ---
	getSn() {
		return this._native.getSn()
	}
	getFamily() {
		return "Obsbot"
	}

	getName() {
		return this._native.getName()
	}

	getProductType() {
		return this._native.getProductType()
	}

	getProductTypeName() {
		const type = this.getProductType()
		return ObsbotProductTypeName[type]
	}

	getUUID() {
		return this._native.getUUID()
	}

	getModelCode() {
		return this._native.getModelCode()
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