const BaseDevice = require('./base_device');

const MediaMode = {
    Normal: 0,
    Background: 1,
    AutoFrame: 2,
};

const BackgroundMode = {
    Disable: 0,
    Color: 1,
    Replace: 17,
    Blur: 18,
};

const BackgroundColor = {
    Blue: 0,
    Green: 1,
    Red: 2,
    Black: 3,
    White: 4,
};

const AutoFramingMode = {
    Group: 0,
    Single: 1,
};

const AutoFramingSingleMode = {
    CloseUp: 0,
    UpperBody: 1,
};

const ResourceAction = {
    Select: 0,
    Delete: 1,
    Mirror: 2,
};

class MeetDevice extends BaseDevice {
    static MediaMode = MediaMode;
    static BackgroundMode = BackgroundMode;
    static BackgroundColor = BackgroundColor;
    static AutoFramingMode = AutoFramingMode;
    static AutoFramingSingleMode = AutoFramingSingleMode;
    static ResourceAction = ResourceAction;

    getStatus() {
        return this._native.getMeetStatus();
    }

    toggleGestureZoom(enable) {
        return this._setGestureControl('zoom', enable);
    }

    setMediaMode(mode) {
        return this._native.setMediaMode(mode);
    }

    setBackgroundMode(mode) {
        return this._native.setBackgroundMode(mode);
    }

    setBackgroundColor(color) {
        return this._native.setBackgroundColor(color);
    }

    setBlurLevel(level) {
        return this._native.setBlurLevel(level);
    }

    setAutoFramingMode(groupSingleMode, closeUpperMode) {
        return this._native.setAutoFramingMode(groupSingleMode, closeUpperMode);
    }

    selectBackgroundImage(index) {
        return this._native.setResourceAction(ResourceAction.Select, index);
    }

    deleteBackgroundImage(index) {
        return this._native.setResourceAction(ResourceAction.Delete, index);
    }
}

module.exports = MeetDevice;
