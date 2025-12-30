import { BaseDevice } from "./base_device.ts"
import type {
	MediaMode,
	BackgroundMode, BackgroundColor,
	AutoFramingMode, AutoFramingCloseUpperMode,
	MeetGestureControl
} from "../src/types.ts"

const MediaMode: Record<'Normal' | 'Background' | 'AutoFrame', MediaMode> = {
	Normal: 0,
	Background: 1,
	AutoFrame: 2,
}

const BackgroundMode: Record<'Disable' | 'Color' | 'Replace' | 'Blur', BackgroundMode> = {
	Disable: 0,
	Color: 1,
	Replace: 17,
	Blur: 18,
}

const BackgroundColor: Record<'Disable' | 'Null' | 'Blue' | 'Green' | 'Red' | 'Black' | 'White', BackgroundColor> = {
	Disable: -2,
	Null: -1,
	Blue: 0,  // background color: blue
	Green: 1, // background color: green
	Red: 2,   // background color: red
	Black: 3, // background color: black
	White: 4, // background color: white
}

const AutoFramingMode: Record<'Group' | 'Single' | 'Null', AutoFramingMode> = {
	Group: 0,
	Single: 1,
	Null: -1,
}

const AutoFramingCloseUpperMode: Record<'CloseUp' | 'UpperBody' | 'Null', AutoFramingCloseUpperMode> = {
	CloseUp: 0,
	UpperBody: 1,
	Null: -1,
}

const ResourceAction: Record<'Select' | 'Delete' | 'Mirror', number> = {
	Select: 0,
	Delete: 1,
	Mirror: 2,
}

export class MeetDevice extends BaseDevice {
	static MediaMode = MediaMode;
	static BackgroundMode = BackgroundMode;
	static BackgroundColor = BackgroundColor;
	static AutoFramingMode = AutoFramingMode;
	static AutoFramingSingleMode = AutoFramingCloseUpperMode;
	static ResourceAction = ResourceAction;

	getFamily() {
		return super.getFamily() + " Meet"
	}

	getStatus() {
		return this._native.getMeetStatus()
	}

	toggleGestureZoom(enable: boolean) {
		return this._setGestureControl('zoom', enable)
	}

	setMediaMode(mode: MediaMode) {
		return this._native.setMediaMode?.(mode)
	}

	setBackgroundMode(mode: BackgroundMode) {
		return this._native.setBackgroundMode?.(mode)
	}

	setBackgroundColor(color: BackgroundColor) {
		return this._native.setBackgroundColor?.(color)
	}

	setBlurLevel(level: number) {
		return this._native.setBlurLevel?.(level)
	}

	setAutoFramingMode(groupSingleMode: AutoFramingMode, closeUpperMode: AutoFramingCloseUpperMode) {
		return this._native.setAutoFramingMode?.(groupSingleMode, closeUpperMode)
	}

	selectBackgroundImage(index: number) {
		return this._native.setResourceAction?.(ResourceAction.Select, index)
	}

	deleteBackgroundImage(index: number) {
		return this._native.setResourceAction?.(ResourceAction.Delete, index)
	}

	_setGestureControl(gesture:  MeetGestureControl, enable: boolean): boolean {
		return this._native.setGestureControl(gesture, enable)
	}
}
