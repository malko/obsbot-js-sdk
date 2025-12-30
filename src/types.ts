// type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
//   ? Acc[number]
//   : Enumerate<N, [...Acc, Acc['length']]>

// export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F> > | T

export type AiTrackSpeedType = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type AiWorkMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type AiSubModeHuman = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type AiVerticalTrackType = 0 | 1 | 2
export type ImageSetting = 'brightness' | 'contrast' | 'saturation' | 'sharpness' | 'hue' //| 'exposure' | 'white_balance' | 'low_light_compensation';
export type GestureControl = 'target' | 'zoom' | 'dynamic_zoom' | 'mirror' | 'record'
export type MeetGestureControl = 'target' | 'zoom'
export type TinyGestureControl = 'target' | 'zoom' | 'dynamic_zoom' | 'mirror'
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
	// Common for all devices
	getSn: () => string
	getName: () => string
	getProductType: () => number
	getUUID: () => string
	getModelCode: () => string
	getVideoDevPath: () => string
	getAudioDevPath: () => string

	getZoom: () => number
	getZoomRange: () => { min: number; max: number }
	setZoom: (zoom: number) => boolean

	setHDR: (enable: boolean) => boolean
	getImageSetting: (setting: ImageSetting) => number
	setImageSetting: (setting: ImageSetting, value: number) => boolean
	saveImageSettings: () => boolean

	getCapabilities?: () => { zoom: { min: number; max: number; default: number; step: number }; brightness: { min: number; max: number; default: number; step: number }; contrast: { min: number; max: number; default: number; step: number }; saturation: { min: number; max: number; default: number; step: number }; sharpness: { min: number; max: number; default: number; step: number }; hue: { min: number; max: number; default: number; step: number } }

	getVideoFps: () => number
	setVideoFps: (fps: number) => boolean
	setVideoResolution: (width: number, height: number) => boolean
	getVideoResolution: () => { width: number; height: number }

	setGestureControl: (control: GestureControl, enable: boolean) => boolean

	// Meet specific
	getMeetStatus?: () => {
		media_mode: number;
		hdr: number;
		dev_status: number;
		face_ae: number;
		fov: number;
		bg_color: number;
		face_auto_focus: boolean;
		auto_focus: boolean;
		manual_focus_value: number;
		image_flip_hor: boolean;
	}
	setMediaMode?: (mode: MediaMode) => boolean
	setBackgroundMode?: (mode: BackgroundMode) => boolean
	setBackgroundColor?: (color: BackgroundColor) => boolean
	setBlurLevel?: (level: number) => boolean
	setAutoFramingMode?: (groupSingleMode: AutoFramingMode, closeUpperMode: AutoFramingCloseUpperMode) => boolean
	setResourceAction?: (action: number, index: number) => boolean

	// Tiny specific
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
	getTinyStatus?: () => {
		glimbal: {roll: number; pitch: number; pan: number};
		zoom: number;
		ai_target: number;
		hdr: number;
		face_ae: number;
		dev_status: number;
		vertical_mode: number;
		face_auto_focus: number;
		auto_focus: number;
		ai_mode: number;
		ai_sub_mode: number;
		led_brightness_level: number;
		zoom_ratio: number;
		gestture_target: boolean;
		gestture_zoom: boolean;
		gestture_dynamic_zoom: boolean;
		gestture_mirror: boolean;
	}
	getPresetList?: () => Array<{ id: number; pitch: number; pan: number; zoom: number }>
	goToPreset?: (id: number) => boolean
	addPreset?: (id: number) => boolean
	deletePreset?: (id: number) => boolean
	toggleAiTracking: (enable: boolean) => boolean
	setAiTrackingMode: (mode: number) => boolean
	setAiMode: (mode: number, sub_mode: number) => boolean

	// Meet and Tiny specific
	toggleGestureZoom?: (enable: boolean) => boolean

}