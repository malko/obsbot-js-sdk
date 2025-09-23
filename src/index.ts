import { createRequire } from "node:module"
const obsbot_native = createRequire(import.meta.url)("../build/Release/obsbot_native.node")
import { BaseDevice } from '../lib/base_device.ts'
import { TinyDevice } from '../lib/tiny_device.ts'
import { MeetDevice } from '../lib/meet_device.ts'
import type { NativeDevice } from './types.ts'
// Future device classes can be added here

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
}

const TINY_FAMILY = [
    ObsbotProductType.ObsbotProdTiny,
    ObsbotProductType.ObsbotProdTiny4k,
    ObsbotProductType.ObsbotProdTiny2,
    ObsbotProductType.ObsbotProdTiny2Lite,
    ObsbotProductType.ObsbotProdTinySE,
]

const MEET_FAMILY = [
    ObsbotProductType.ObsbotProdMeet,
    ObsbotProductType.ObsbotProdMeet4k,
    ObsbotProductType.ObsbotProdMeet2,
    ObsbotProductType.ObsbotProdMeetSE,
]
const TAIL_FAMILY = [
    ObsbotProductType.ObsbotProdTailAir,
    ObsbotProductType.ObsbotProdTail2,
    ObsbotProductType.ObsbotProdTail2S,
]

function deviceFactory(nativeDevice: NativeDevice) {
    const productType = nativeDevice.getProductType()

    if (TINY_FAMILY.includes(productType)) {
        return new TinyDevice(nativeDevice)
    }
    // Add more families here
    if (MEET_FAMILY.includes(productType)) {
        return new MeetDevice(nativeDevice)
    }

    // Fallback to the base device for unknown models
    return new BaseDevice(nativeDevice)
}
export const osbotSdk = {
    // --- High-level API ---
    init: obsbot_native.initSDK,
    release: obsbot_native.deinitSDK,
    setDevChangedCallback: obsbot_native.setDevChangedCallback,
    /**
     * Returns an array of model-specific device instances (e.g., TinyDevice).
     * @returns {BaseDevice[]}
     */
    getDevList: () => {
        const nativeList: NativeDevice[] = obsbot_native.getDevList()
        return nativeList.map(deviceFactory)
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
}