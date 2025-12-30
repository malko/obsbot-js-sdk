import { BaseDevice } from "./base_device.ts"
import type {
	AiWorkMode,
	AiSubModeHuman,
	AiVerticalTrackType,
	BackgroundMode,
	AiTrackSpeedType,
	TinyGestureControl
} from "../src/types.ts"


export const AiWorkModes: Record<'None' | 'Group' | 'Human' | 'Hand' | 'WhiteBoard' | 'Desk' | 'Butt', AiWorkMode> = {
	None: 0,
	Group: 1,
	Human: 2,
	Hand: 3,
	WhiteBoard: 4,
	Desk: 5,
	Butt: 7
}

export const AiSubModeHumans: Record<'Normal' | 'UpperBody' | 'CloseUp' | 'Headless' | 'LowerBody' | 'Butt', AiSubModeHuman> = {
	Normal: 0,
	UpperBody: 1,
	CloseUp: 2,
	Headless: 3,
	LowerBody: 4,
	Butt: 5
}

export const AiVerticalTrackTypes: Record<'Standard' | 'Headroom' | 'Motion', AiVerticalTrackType> = {
	Standard: 0,
	Headroom: 1,
	Motion: 2,
}

const BackgroundMode: Record<'Disable' | 'Color' | 'Replace' | 'Blur', BackgroundMode> = {
	Disable: 0,
	Color: 1,
	Replace: 17,
	Blur: 18,
}

export class TinyDevice extends BaseDevice {
	static AiWorkMode = AiWorkModes;
	static AiSubModeHuman = AiSubModeHumans;
	static AiVerticalTrackType = AiVerticalTrackTypes;
	static BackgroundMode = BackgroundMode;

	getFamily() {
		return "Tiny"
	}

	setBackgroundMode(mode: BackgroundMode) {
		return this._native.setBackgroundMode?.(mode)
	}

	// --- Gimbal Control ---
	gimbalReset() {
		return this._native.gimbalReset()
	}

	gimbalMove(pitch: number, pan: number) {
		return this._native.gimbalMove(pitch, pan)
	}

	getStatus() {
		return this._native.getTinyStatus()
	}

	// --- AI Control ---

	toggleGestureTarget(enable: boolean) {
		return this._setGestureControl('target', enable)
	}

	toggleGestureZoom(enable: boolean) {
		return this._setGestureControl('zoom', enable)
	}

	toggleGestureDynamicZoom(enable: boolean) {
		return this._setGestureControl('dynamic_zoom', enable)
	}

	toggleGestureMirror(enable: boolean) {
		return this._setGestureControl('mirror', enable)
	}

	setAiTrackingMode(mode: AiVerticalTrackType) {
		return this._native.setAiTrackingMode(mode)
	}

	setAiMode(mode: AiWorkMode, sub_mode: AiSubModeHuman = AiSubModeHumans.Normal) {
		return this._native.setAiMode(mode, sub_mode)
	}

	// --- Preset Management ---
	getPresetList() {
		return this._native.getPresetList?.()
	}

	goToPreset(id: number) {
		return this._native.goToPreset?.(id)
	}

	addPreset(id: number) {
		return this._native.addPreset?.(id)
	}

	deletePreset(id: number) {
		return this._native.deletePreset?.(id)
	}

	_setGestureControl(gesture: TinyGestureControl, enable: boolean): boolean {
		return this._native.setGestureControl(gesture, enable)
	}
}