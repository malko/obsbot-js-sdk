const obsbot_native = require('../build/Release/obsbot_native.node');
const BaseDevice = require('../lib/base_device.js');
const TinyDevice = require('../lib/tiny_device.js');
// Future device classes can be added here
const MeetDevice = require('../lib/meet_device.js');
// const TailDevice = require('./lib/tail_device.js);');

const ObsbotProductType = {
    ObsbotProdTiny: 0,
    ObsbotProdTiny4k: 1,
    ObsbotProdTiny2: 2,
    ObsbotProdTiny2Lite: 3,
    ObsbotProdTailAir: 4,
    ObsbotProdMeet: 5,
    ObsbotProdMeet4k: 6,
    ObsbotProdMe: 7,
    ObsbotProdHDMIBox: 8,
    ObsbotProdNDIBox: 9,
    ObsbotProdMeet2: 10,
    ObsbotProdTail2: 11,
    ObsbotProdTinySE: 12,
    ObsbotProdMeetSE: 13,
    ObsbotProdTail2S: 16,
};

const TINY_FAMILY = [
    ObsbotProductType.ObsbotProdTiny,
    ObsbotProductType.ObsbotProdTiny4k,
    ObsbotProductType.ObsbotProdTiny2,
    ObsbotProductType.ObsbotProdTiny2Lite,
    ObsbotProductType.ObsbotProdTinySE,
];

const MEET_FAMILY = [
    ObsbotProductType.ObsbotProdMeet,
    ObsbotProductType.ObsbotProdMeet4k,
    ObsbotProductType.ObsbotProdMeet2,
    ObsbotProductType.ObsbotProdMeetSE,
];
// const TAIL_FAMILY = [ ... ];

function deviceFactory(nativeDevice) {
    const productType = nativeDevice.getProductType();

    if (TINY_FAMILY.includes(productType)) {
        return new TinyDevice(nativeDevice);
    }
    // Add more families here
    if (MEET_FAMILY.includes(productType)) {
        return new MeetDevice(nativeDevice);
    }

    // Fallback to the base device for unknown models
    return new BaseDevice(nativeDevice);
}

module.exports = {
    // --- High-level API ---
    initSDK: obsbot_native.initSDK,
    deinitSDK: obsbot_native.deinitSDK,
    setDevChangedCallback: obsbot_native.setDevChangedCallback,
    /**
     * Returns an array of model-specific device instances (e.g., TinyDevice).
     * @returns {BaseDevice[]}
     */
    getDevList: () => {
        const nativeList = obsbot_native.getDevList();
        return nativeList.map(deviceFactory);
    },
    // Export classes and enums for external use and type checking
    ObsbotProductType,
    BaseDevice,
    TinyDevice,
    MeetDevice,

    // --- Low-level Native API ---
    /**
     * Direct access to the underlying native module and its raw Device objects.
     */
    native: obsbot_native
};