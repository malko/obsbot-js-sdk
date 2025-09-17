import { BaseDevice } from "./base_device.ts"
import type {
	AiWorkMode,
	AiSubModeHuman,
	AiVerticalTrackType
} from "../src/types.ts"


export const AiWorkModes: Record<string, AiWorkMode> = {
	None: 0,
	Group: 1,
	Human: 2,
	Hand: 3,
	WhiteBoard: 4,
	Desk: 5,
}

export const AiSubModeHumans: Record<string, AiSubModeHuman> = {
	Normal: 0,
	UpperBody: 1,
	CloseUp: 2,
}

export const AiVerticalTrackTypes: Record<string, AiVerticalTrackType> = {
	Standard: 0,
	Headroom: 1,
	Motion: 2,
}

export class TinyDevice extends BaseDevice {
	static AiWorkMode = AiWorkModes;
	static AiSubModeHuman = AiSubModeHumans;
	static AiVerticalTrackType = AiVerticalTrackTypes;

	// --- AI Control ---
	getAiStatus() {
		return this._native.getAiStatus()
	}

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
}