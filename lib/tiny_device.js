const BaseDevice = require('./base_device');

const AiWorkMode = {
    None: 0,
    Group: 1,
    Human: 2,
    Hand: 3,
    WhiteBoard: 4,
    Desk: 5,
};

const AiSubModeHuman = {
    Normal: 0,
    UpperBody: 1,
    CloseUp: 2,
};

const AiVerticalTrackType = {
    Standard: 0,
    Headroom: 1,
    Motion: 2,
};

class TinyDevice extends BaseDevice {
    static AiWorkMode = AiWorkMode;
    static AiSubModeHuman = AiSubModeHuman;
    static AiVerticalTrackType = AiVerticalTrackType;

    // --- AI Control ---
    getAiStatus() {
        return this._native.getAiStatus();
    }

    setAiTrackingMode(mode) {
        return this._native.setAiTrackingMode(mode);
    }

    setAiMode(mode, sub_mode) {
        return this._native.setAiMode(mode, sub_mode);
    }

    // --- Preset Management ---
    getPresetList() {
        return this._native.getPresetList();
    }

    goToPreset(id) {
        return this._native.goToPreset(id);
    }

    addPreset(id) {
        return this._native.addPreset(id);
    }

    deletePreset(id) {
        return this._native.deletePreset(id);
    }
}

module.exports = TinyDevice;
