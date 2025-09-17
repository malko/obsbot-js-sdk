// type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
//   ? Acc[number]
//   : Enumerate<N, [...Acc, Acc['length']]>

// export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F> > | T


export type AiWorkMode = 0 | 1 | 2 | 3 | 4 | 5
export type AiSubModeHuman = 0 | 1 | 2
export type AiVerticalTrackType = 0 | 1 | 2
export type ImageSetting = 'brightness' | 'contrast' | 'saturation' | 'sharpness' | 'hue' //| 'exposure' | 'white_balance' | 'low_light_compensation';
export type GestureControl = 'target' | 'zoom' | 'dynamic_zoom' | 'mirror' | 'record'

/**
 * 0: Normal mode
 * 1: virtual background mode
 * 2: AutoFraming mode
 * 255: unknown mode
 */
export type MediaMode = 0 | 1 | 2 | 255

/**
 * Background mode
 * 0: off
 * 1: virtual background: green mode
 * 17: virtual background: replace mode
 * 18: virtual background: blur mode
 */
export type BackgroundMode = 0 | 1 | 17 | 18

export type BackgroundColor = -2 | -1 | 0 | 1 | 2 | 3 | 4

/** 0 group mode / 1 single mode / -1 null */
export type AutoFramingMode = 0 | 1 | -1
/** 0 close up mode / 1 upper body mode / -1 null */
export type AutoFramingCloseUpperMode = 0 | 1 | -1


export type NativeDevice = {
	getProductType: () => number
	getSn: () => string
	getName: () => string
	getVideoDevPath: () => string
	getAudioDevPath: () => string
	gimbalReset: () => boolean
	/**
	 * Move the gimbal to a specific pitch and pan position.
	 * @param pitch The pitch angle to move to, in degrees -90 to 90.
	 * @param pan The pan angle to move to, in degrees -180 to 180.
	 * @returns True if the gimbal was moved successfully, false otherwise.
	 */
	gimbalMove: (pitch: number, pan: number) => boolean
	/**
	 * Set the zoom level of the camera.
	 * @param zoom Zoom level to set, typically ranging from 1 to the device's maximum zoom level. 1.0 to 2.0
	 * @returns
	 */
	setZoom: (zoom: number) => boolean
	/** @returns The current zoom level of the camera. 1.0 to 2.0 */
	getZoom: () => number
	getZoomRange: () => { min: number; max: number }
	setHDR: (enable: boolean) => boolean
	setImageSetting: (setting: ImageSetting, value: number) => boolean
	getImageSetting: (setting: ImageSetting) => number
	saveImageSettings: () => boolean
	setVideoFps: (fps: number) => boolean
	getVideoFps: () => number
	setVideoResolution: (width: number, height: number) => boolean
	getVideoResolution: () => { width: number; height: number }
	getAiStatus: () => { work_mode: number; sub_mode: number; target_locked: boolean; human_count: number; hand_count: number; whiteboard_count: number; desk_count: number }
	setAiMode: (mode: number, sub_mode: number) => boolean
	setAiTrackingMode: (mode: number) => boolean
	toggleAiTracking: (enable: boolean) => boolean
	setGestureControl: (control: GestureControl, enable: boolean) => boolean
	// Meet specific
	getMeetStatus?: () => { work_mode: number; background_mode: number; background_color: number; blur_level: number; human_count: number; is_blurred: boolean; is_bg_removed: boolean; is_bg_replaced: boolean; af_mode: number; af_sub_mode: number }
	toggleGestureZoom?: (enable: boolean) => boolean
	setMediaMode?: (mode: MediaMode) => boolean
	setBackgroundMode?: (mode: BackgroundMode) => boolean
	setBackgroundColor?: (color: BackgroundColor) => boolean
	setBlurLevel?: (level: number) => boolean
	setAutoFramingMode?: (groupSingleMode: AutoFramingMode, closeUpperMode: AutoFramingCloseUpperMode) => boolean
	setResourceAction?: (action: number, index: number) => boolean
	// Tiny specific
	getPresetList?: () => Array<{ id: number; pitch: number; pan: number; zoom: number }>
	goToPreset?: (id: number) => boolean
	addPreset?: (id: number) => boolean
	deletePreset?: (id: number) => boolean
	getCapabilities?: () => { zoom: { min: number; max: number; default: number; step: number }; brightness: { min: number; max: number; default: number; step: number }; contrast: { min: number; max: number; default: number; step: number }; saturation: { min: number; max: number; default: number; step: number }; sharpness: { min: number; max: number; default: number; step: number }; hue: { min: number; max: number; default: number; step: number } }
}