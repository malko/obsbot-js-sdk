#include "../node_modules/node-addon-api/napi.h"
#include "dev/devs.hpp"
#include "dev/dev.hpp"
#include <iostream>
#include <memory>
#include <thread>
#include <map>

// Forward declaration
class DeviceWrap;

// Global context for device change callbacks
struct TsfnContext {
    Napi::ThreadSafeFunction tsfn;
};

// Map to keep shared_ptr to DeviceWrap alive
static std::map<std::string, std::shared_ptr<DeviceWrap>> g_deviceWrappers;

// Callback from SDK, called on a separate thread
void OnDevChanged(std::string sn, bool attached, void *p) {
    auto tsfnContext = (TsfnContext*)p;

    auto callback = [sn, attached](Napi::Env env, Napi::Function jsCallback) {
        jsCallback.Call({Napi::String::New(env, sn), Napi::Boolean::New(env, attached)});
    };

    tsfnContext->tsfn.BlockingCall(callback);

    if (!attached) {
        g_deviceWrappers.erase(sn);
    }
}

// Function to register the JS callback for device changes
Napi::Value SetDevChangedCallback(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsFunction()) {
        Napi::TypeError::New(env, "Function expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    auto tsfnContext = new TsfnContext();
    tsfnContext->tsfn = Napi::ThreadSafeFunction::New(
        env,
        info[0].As<Napi::Function>(),
        "DevChangedCallback",
        0,
        1,
        [tsfnContext](Napi::Env) {
            delete tsfnContext;
        }
    );

    Devices::get().setDevChangedCallback(OnDevChanged, tsfnContext);

    return env.Undefined();
}


class DeviceWrap : public Napi::ObjectWrap<DeviceWrap> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    DeviceWrap(const Napi::CallbackInfo& info);
    void SetDevice(std::shared_ptr<Device> dev);
    std::shared_ptr<Device> GetDevice();
    static Napi::FunctionReference constructor;

private:
    std::shared_ptr<Device> device_ = nullptr;

    Napi::Value GetSn(const Napi::CallbackInfo& info);
    Napi::Value GetName(const Napi::CallbackInfo& info);
    Napi::Value GetProductType(const Napi::CallbackInfo& info);
    Napi::Value GimbalReset(const Napi::CallbackInfo& info);
    Napi::Value GimbalMove(const Napi::CallbackInfo& info);
    Napi::Value SetZoom(const Napi::CallbackInfo& info);
    // New methods for AI, Zoom, and Presets
    Napi::Value GetZoom(const Napi::CallbackInfo& info);
    Napi::Value GetZoomRange(const Napi::CallbackInfo& info);
    Napi::Value GetAiStatus(const Napi::CallbackInfo& info);
    Napi::Value SetAiTrackingMode(const Napi::CallbackInfo& info);
    Napi::Value SetAiMode(const Napi::CallbackInfo& info);
    Napi::Value GetPresetList(const Napi::CallbackInfo& info);
    Napi::Value GoToPreset(const Napi::CallbackInfo& info);
    Napi::Value AddPreset(const Napi::CallbackInfo& info);
    Napi::Value DeletePreset(const Napi::CallbackInfo& info);
    // New methods for device paths and more settings
    Napi::Value GetVideoDevPath(const Napi::CallbackInfo& info);
    Napi::Value GetAudioDevPath(const Napi::CallbackInfo& info);
    Napi::Value SetHDR(const Napi::CallbackInfo& info);
    Napi::Value SetImageSetting(const Napi::CallbackInfo& info);
    Napi::Value GetImageSetting(const Napi::CallbackInfo& info);
    // New methods for Meet family
    Napi::Value SetMediaMode(const Napi::CallbackInfo& info);
    Napi::Value SetBackgroundMode(const Napi::CallbackInfo& info);
    Napi::Value SetBackgroundColor(const Napi::CallbackInfo& info);
    Napi::Value SetBlurLevel(const Napi::CallbackInfo& info);
    Napi::Value SetAutoFramingMode(const Napi::CallbackInfo& info);
    Napi::Value SetResourceAction(const Napi::CallbackInfo& info);
    Napi::Value GetMeetStatus(const Napi::CallbackInfo& info);
    // New method for capabilities
    Napi::Value GetCapabilities(const Napi::CallbackInfo& info);
    // New method for gesture control
    Napi::Value SetGestureControl(const Napi::CallbackInfo& info);
};

Napi::FunctionReference DeviceWrap::constructor;

Napi::Object DeviceWrap::Init(Napi::Env env, Napi::Object exports) {
    Napi::HandleScope scope(env);
    Napi::Function func = DefineClass(env, "Device", {
        InstanceMethod("getSn", &DeviceWrap::GetSn),
        InstanceMethod("getName", &DeviceWrap::GetName),
        InstanceMethod("getProductType", &DeviceWrap::GetProductType),
        InstanceMethod("gimbalReset", &DeviceWrap::GimbalReset),
        InstanceMethod("gimbalMove", &DeviceWrap::GimbalMove),
        InstanceMethod("setZoom", &DeviceWrap::SetZoom),
        // New methods
        InstanceMethod("getZoom", &DeviceWrap::GetZoom),
        InstanceMethod("getZoomRange", &DeviceWrap::GetZoomRange),
        InstanceMethod("getAiStatus", &DeviceWrap::GetAiStatus),
        InstanceMethod("setAiTrackingMode", &DeviceWrap::SetAiTrackingMode),
        InstanceMethod("setAiMode", &DeviceWrap::SetAiMode),
        InstanceMethod("getPresetList", &DeviceWrap::GetPresetList),
        InstanceMethod("goToPreset", &DeviceWrap::GoToPreset),
        InstanceMethod("addPreset", &DeviceWrap::AddPreset),
        InstanceMethod("deletePreset", &DeviceWrap::DeletePreset),
        // New methods for device paths and more settings
        InstanceMethod("getVideoDevPath", &DeviceWrap::GetVideoDevPath),
        InstanceMethod("getAudioDevPath", &DeviceWrap::GetAudioDevPath),
        InstanceMethod("setHDR", &DeviceWrap::SetHDR),
        InstanceMethod("setImageSetting", &DeviceWrap::SetImageSetting),
        InstanceMethod("getImageSetting", &DeviceWrap::GetImageSetting),
        // New methods for Meet family
        InstanceMethod("setMediaMode", &DeviceWrap::SetMediaMode),
        InstanceMethod("setBackgroundMode", &DeviceWrap::SetBackgroundMode),
        InstanceMethod("setBackgroundColor", &DeviceWrap::SetBackgroundColor),
        InstanceMethod("setBlurLevel", &DeviceWrap::SetBlurLevel),
        InstanceMethod("setAutoFramingMode", &DeviceWrap::SetAutoFramingMode),
        InstanceMethod("setResourceAction", &DeviceWrap::SetResourceAction),
        InstanceMethod("getMeetStatus", &DeviceWrap::GetMeetStatus),
        // New method for capabilities
        InstanceMethod("getCapabilities", &DeviceWrap::GetCapabilities),
        // New method for gesture control
        InstanceMethod("setGestureControl", &DeviceWrap::SetGestureControl),
    });
    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();
    exports.Set("Device", func);
    return exports;
}

DeviceWrap::DeviceWrap(const Napi::CallbackInfo& info) : Napi::ObjectWrap<DeviceWrap>(info) {}

void DeviceWrap::SetDevice(std::shared_ptr<Device> dev) {
    device_ = dev;
}

std::shared_ptr<Device> DeviceWrap::GetDevice() {
    return device_;
}

Napi::Value DeviceWrap::GetSn(const Napi::CallbackInfo& info) {
    return Napi::String::New(info.Env(), device_ ? device_->devSn() : "");
}

Napi::Value DeviceWrap::GetName(const Napi::CallbackInfo& info) {
    return Napi::String::New(info.Env(), device_ ? device_->devName() : "");
}

Napi::Value DeviceWrap::GetProductType(const Napi::CallbackInfo& info) {
    return Napi::Number::New(info.Env(), device_ ? device_->productType() : -1);
}

Napi::Value DeviceWrap::GimbalReset(const Napi::CallbackInfo& info) {
    int result = device_ ? device_->gimbalRstPosR() : -1;
    return Napi::Number::New(info.Env(), result);
}

Napi::Value DeviceWrap::GimbalMove(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
        Napi::TypeError::New(env, "Two numbers expected for pitch and pan speed").ThrowAsJavaScriptException();
        return env.Null();
    }
    double pitch = info[0].As<Napi::Number>().DoubleValue();
    double pan = info[1].As<Napi::Number>().DoubleValue();
    int result = device_ ? device_->gimbalSpeedCtrlR(pitch, pan) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::SetZoom(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected for zoom value").ThrowAsJavaScriptException();
        return env.Null();
    }
    float zoom = info[0].As<Napi::Number>().FloatValue();
    int result = device_ ? device_->cameraSetZoomAbsoluteR(zoom) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::GetZoom(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    float zoom = 0.0;
    if (device_) {
        device_->cameraGetZoomAbsoluteR(zoom);
    }
    return Napi::Number::New(env, zoom);
}

Napi::Value DeviceWrap::GetZoomRange(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Device::UvcParamRange range;
    if (device_) {
        device_->cameraGetRangeZoomAbsoluteR(range);
    }
    Napi::Object rangeObj = Napi::Object::New(env);
    rangeObj.Set("min", Napi::Number::New(env, range.min_));
    rangeObj.Set("max", Napi::Number::New(env, range.max_));
    rangeObj.Set("default", Napi::Number::New(env, range.default_));
    return rangeObj;
}

Napi::Value DeviceWrap::GetAiStatus(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Device::CameraStatus status;
    if (device_) {
        // Use cameraGetCameraStatusU as it provides more reliable live data for Tiny series
        device_->cameraGetCameraStatusU(status);
    }
    Napi::Object statusObj = Napi::Object::New(env);
    // Populate from the 'tiny' part of the CameraStatus union
    statusObj.Set("ai_target", Napi::Number::New(env, status.tiny.ai_target));
    statusObj.Set("hdr", Napi::Number::New(env, status.tiny.hdr));
    statusObj.Set("face_ae", Napi::Number::New(env, status.tiny.face_ae));
    statusObj.Set("dev_status", Napi::Number::New(env, status.tiny.dev_status));
    statusObj.Set("vertical_mode", Napi::Number::New(env, status.tiny.vertical));
    statusObj.Set("face_auto_focus", Napi::Number::New(env, status.tiny.face_auto_focus));
    statusObj.Set("auto_focus", Napi::Number::New(env, status.tiny.auto_focus));
    statusObj.Set("ai_mode", Napi::Number::New(env, status.tiny.ai_mode));
    statusObj.Set("ai_sub_mode", Napi::Number::New(env, status.tiny.ai_sub_mode));
    statusObj.Set("led_brightness_level", Napi::Number::New(env, status.tiny.led_brightness_level));

    // Also get gesture info from the other status call for completeness
    Device::AiStatus gestureStatus;
    if (device_) {
        device_->aiGetAiStatusR(&gestureStatus);
    }
    statusObj.Set("gesture_target", Napi::Boolean::New(env, gestureStatus.gesture_target));
    statusObj.Set("gesture_zoom", Napi::Boolean::New(env, gestureStatus.gesture_zoom));
    statusObj.Set("gesture_dynamic_zoom", Napi::Boolean::New(env, gestureStatus.gesture_dynamic_zoom));
    statusObj.Set("gesture_mirror", Napi::Boolean::New(env, gestureStatus.gesture_mirror));

    return statusObj;
}

Napi::Value DeviceWrap::SetAiTrackingMode(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected for tracking mode").ThrowAsJavaScriptException();
        return env.Null();
    }
    auto mode = (Device::AiVerticalTrackType)info[0].As<Napi::Number>().Int32Value();
    int result = device_ ? device_->aiSetTrackingModeR(mode) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::SetAiMode(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected for AI mode").ThrowAsJavaScriptException();
        return env.Null();
    }
    auto mode = (Device::AiWorkModeType)info[0].As<Napi::Number>().Int32Value();
    int sub_mode = 0;
    if (info.Length() > 1 && info[1].IsNumber()) {
        sub_mode = info[1].As<Napi::Number>().Int32Value();
    }
    int result = device_ ? device_->cameraSetAiModeU(mode, sub_mode) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::GetPresetList(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Device::DevDataArray ids;
    if (device_) {
        device_->aiGetGimbalPresetListR(&ids);
    }
    Napi::Array idArray = Napi::Array::New(env, ids.len);
    for (int i = 0; i < ids.len; ++i) {
        idArray[i] = Napi::Number::New(env, ids.data_int32[i]);
    }
    return idArray;
}

Napi::Value DeviceWrap::GoToPreset(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected for preset ID").ThrowAsJavaScriptException();
        return env.Null();
    }
    int presetId = info[0].As<Napi::Number>().Int32Value();
    int result = device_ ? device_->aiTrgGimbalPresetR(presetId) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::AddPreset(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected for preset ID").ThrowAsJavaScriptException();
        return env.Null();
    }
    int presetId = info[0].As<Napi::Number>().Int32Value();
    Device::PresetPosInfo presetInfo;
    presetInfo.id = presetId;
    int result = device_ ? device_->aiAddGimbalPresetR(&presetInfo) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::DeletePreset(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected for preset ID").ThrowAsJavaScriptException();
        return env.Null();
    }
    int presetId = info[0].As<Napi::Number>().Int32Value();
    int result = device_ ? device_->aiDelGimbalPresetR(presetId) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::GetVideoDevPath(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    return Napi::String::New(env, device_ ? device_->videoDevPath() : "");
}

Napi::Value DeviceWrap::GetAudioDevPath(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    return Napi::String::New(env, device_ ? device_->audioDevPath() : "");
}

Napi::Value DeviceWrap::SetHDR(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsBoolean()) {
        Napi::TypeError::New(env, "Boolean expected for HDR state").ThrowAsJavaScriptException();
        return env.Null();
    }
    bool enable = info[0].As<Napi::Boolean>().Value();
    int result = device_ ? device_->cameraSetWdrR(enable ? Device::DevWdrMode::DevWdrModeDol2TO1 : Device::DevWdrMode::DevWdrModeNone) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::SetImageSetting(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsNumber()) {
        Napi::TypeError::New(env, "String and Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    std::string setting = info[0].As<Napi::String>().Utf8Value();
    int32_t value = info[1].As<Napi::Number>().Int32Value();
    int result = -1;

    if (device_) {
        if (setting == "brightness") result = device_->cameraSetImageBrightnessR(value);
        else if (setting == "contrast") result = device_->cameraSetImageContrastR(value);
        else if (setting == "saturation") result = device_->cameraSetImageSaturationR(value);
        else if (setting == "sharpness") result = device_->cameraSetImageSharpR(value);
        else if (setting == "hue") result = device_->cameraSetImageHueR(value);
    }
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::GetImageSetting(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    std::string setting = info[0].As<Napi::String>().Utf8Value();
    int32_t value = -1;

    if (device_) {
        if (setting == "brightness") device_->cameraGetImageBrightnessR(value);
        else if (setting == "contrast") device_->cameraGetImageContrastR(value);
        else if (setting == "saturation") device_->cameraGetImageSaturationR(value);
        else if (setting == "sharpness") device_->cameraGetImageSharpR(value);
        else if (setting == "hue") device_->cameraGetImageHueR(value);
    }
    return Napi::Number::New(env, value);
}

Napi::Value DeviceWrap::SetMediaMode(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected for media mode").ThrowAsJavaScriptException();
        return env.Null();
    }
    auto mode = (Device::MediaMode)info[0].As<Napi::Number>().Int32Value();
    int result = device_ ? device_->cameraSetMediaModeU(mode) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::SetBackgroundMode(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected for background mode").ThrowAsJavaScriptException();
        return env.Null();
    }
    auto mode = (Device::MediaBgMode)info[0].As<Napi::Number>().Int32Value();
    int result = device_ ? device_->cameraSetBgModeU(mode) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::SetBackgroundColor(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected for background color").ThrowAsJavaScriptException();
        return env.Null();
    }
    auto color = (Device::MediaBgModeColorType)info[0].As<Napi::Number>().Int32Value();
    int result = device_ ? device_->cameraSetBgColorU(color) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::SetBlurLevel(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected for blur level").ThrowAsJavaScriptException();
        return env.Null();
    }
    int level = info[0].As<Napi::Number>().Int32Value();
    int result = device_ ? device_->cameraSetMaskLevelU(level) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::SetAutoFramingMode(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
        Napi::TypeError::New(env, "Two numbers expected for framing modes").ThrowAsJavaScriptException();
        return env.Null();
    }
    auto group_single = (Device::AutoFramingType)info[0].As<Napi::Number>().Int32Value();
    auto close_upper = (Device::AutoFramingType)info[1].As<Napi::Number>().Int32Value();
    int result = device_ ? device_->cameraSetAutoFramingModeU(group_single, close_upper) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::SetResourceAction(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
        Napi::TypeError::New(env, "Two numbers expected for action and index/state").ThrowAsJavaScriptException();
        return env.Null();
    }
    int action = info[0].As<Napi::Number>().Int32Value();
    int idx_or_state = info[1].As<Napi::Number>().Int32Value();
    int result = device_ ? device_->cameraSetResourceActionU(action, idx_or_state) : -1;
    return Napi::Number::New(env, result);
}

Napi::Value DeviceWrap::GetMeetStatus(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Device::CameraStatus status;
    if (device_) {
        device_->cameraGetCameraStatusU(status);
    }
    Napi::Object statusObj = Napi::Object::New(env);
    statusObj.Set("media_mode", Napi::Number::New(env, status.meet.media_mode));
    statusObj.Set("hdr", Napi::Number::New(env, status.meet.hdr));
    statusObj.Set("dev_status", Napi::Number::New(env, status.meet.dev_status));
    statusObj.Set("face_ae", Napi::Number::New(env, status.meet.face_ae));
    statusObj.Set("fov", Napi::Number::New(env, status.meet.fov));
    statusObj.Set("bg_mode", Napi::Number::New(env, status.meet.bg_mode));
    statusObj.Set("blur_level", Napi::Number::New(env, status.meet.blur_level));
    statusObj.Set("anti_flicker", Napi::Number::New(env, status.meet.anti_flicker));
    statusObj.Set("zoom_ratio", Napi::Number::New(env, status.meet.zoom_ratio));
    statusObj.Set("noise_cancellation", Napi::Boolean::New(env, status.meet.noise_cancellation));
    statusObj.Set("vertical_mode", Napi::Boolean::New(env, status.meet.vertical));
    statusObj.Set("group_single", Napi::Number::New(env, status.meet.group_single));
    statusObj.Set("close_upper", Napi::Number::New(env, status.meet.close_upper));
    statusObj.Set("auto_sleep_time", Napi::Number::New(env, status.meet.auto_sleep_time));
    statusObj.Set("bg_color", Napi::Number::New(env, status.meet.bg_color));
    statusObj.Set("face_auto_focus", Napi::Boolean::New(env, status.meet.face_auto_focus));
    statusObj.Set("auto_focus", Napi::Boolean::New(env, status.meet.auto_focus));
    statusObj.Set("manual_focus_value", Napi::Number::New(env, status.meet.manual_focus_value));
    statusObj.Set("image_flip_hor", Napi::Boolean::New(env, status.meet.image_flip_hor));
    return statusObj;
}

Napi::Value DeviceWrap::GetCapabilities(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Object capabilities = Napi::Object::New(env);

    if (!device_) {
        return capabilities;
    }

    auto createRangeObject = [&](const Device::UvcParamRange& range) {
        Napi::Object rangeObj = Napi::Object::New(env);
        rangeObj.Set("min", Napi::Number::New(env, range.min_));
        rangeObj.Set("max", Napi::Number::New(env, range.max_));
        rangeObj.Set("step", Napi::Number::New(env, range.step_));
        rangeObj.Set("default", Napi::Number::New(env, range.default_));
        return rangeObj;
    };

    Device::UvcParamRange range;

    if (device_->cameraGetRangeZoomAbsoluteR(range) == RM_RET_OK) {
        capabilities.Set("zoom", createRangeObject(range));
    }
    if (device_->cameraGetRangeImageBrightnessR(range) == RM_RET_OK) {
        capabilities.Set("brightness", createRangeObject(range));
    }
    if (device_->cameraGetRangeImageContrastR(range) == RM_RET_OK) {
        capabilities.Set("contrast", createRangeObject(range));
    }
    if (device_->cameraGetRangeImageSaturationR(range) == RM_RET_OK) {
        capabilities.Set("saturation", createRangeObject(range));
    }
    if (device_->cameraGetRangeImageSharpR(range) == RM_RET_OK) {
        capabilities.Set("sharpness", createRangeObject(range));
    }
    if (device_->cameraGetRangeImageHueR(range) == RM_RET_OK) {
        capabilities.Set("hue", createRangeObject(range));
    }
    if (device_->cameraGetRangeWhiteBalanceR(range) == RM_RET_OK) {
        capabilities.Set("whiteBalance", createRangeObject(range));
    }
    if (device_->cameraGetRangeFocusAbsolute(range) == RM_RET_OK) {
        capabilities.Set("focus", createRangeObject(range));
    }

    return capabilities;
}

Napi::Value DeviceWrap::SetGestureControl(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsBoolean()) {
        Napi::TypeError::New(env, "String and Boolean expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string gesture_str = info[0].As<Napi::String>().Utf8Value();
    bool enable = info[1].As<Napi::Boolean>().Value();
    int32_t gesture_type = -1;

    if (gesture_str == "target") gesture_type = 0;
    else if (gesture_str == "zoom") gesture_type = 1;
    else if (gesture_str == "dynamic_zoom") gesture_type = 2;
    else if (gesture_str == "mirror") gesture_type = 3;
    else if (gesture_str == "record") gesture_type = 4;

    if (gesture_type == -1) {
        Napi::TypeError::New(env, "Invalid gesture type string").ThrowAsJavaScriptException();
        return env.Null();
    }

    int result = device_ ? device_->aiSetGestureCtrlIndividualR(gesture_type, enable) : -1;
    return Napi::Number::New(env, result);
}

static bool g_debugMode = false;

// Custom log handler to suppress messages unless debug mode is enabled
void CustomLogHandler(int32_t lvl, const char *msg, va_list args, void *p) {
    if (!g_debugMode) {
        // Suppress all logs unless debug mode is enabled
        return;
    }
    // prefix message with level in friendly format
    const char* levelStr = "";
    switch (lvl) {
        case DEV_DEBUG: levelStr = "[DEBUG:Obsbot Sdk] "; break;
        case DEV_INFO: levelStr = "[INFO:Obsbot Sdk] "; break;
        case DEV_WARN: levelStr = "[WARN:Obsbot Sdk] "; break;
        case DEV_ERROR: levelStr = "[ERROR:Obsbot Sdk] "; break;
        default: levelStr = "[UNKNOWN:Obsbot Sdk] "; break;
    }
    printf("%s", levelStr);
    vprintf(msg, args);
    printf("\n");
}

Napi::Value GetDevList(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    auto dev_list = Devices::get().getDevList();
    Napi::Array js_dev_list = Napi::Array::New(env, dev_list.size());
    int i = 0;
    for (auto& dev : dev_list) {
        std::string sn = dev->devSn();
        Napi::Object device_obj;

        if (g_deviceWrappers.find(sn) == g_deviceWrappers.end()) {
            Napi::Object obj = DeviceWrap::constructor.New({});
            DeviceWrap* wrapper = Napi::ObjectWrap<DeviceWrap>::Unwrap(obj);
            wrapper->SetDevice(dev);
            g_deviceWrappers[sn] = std::shared_ptr<DeviceWrap>(wrapper);
            device_obj = obj;
        } else {
            device_obj = g_deviceWrappers[sn]->Value();
        }
        js_dev_list[i++] = device_obj;
    }
    return js_dev_list;
}

Napi::Value InitSDK(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // Check if debug mode is requested
    if (info.Length() > 0 && info[0].IsBoolean()) {
        g_debugMode = info[0].As<Napi::Boolean>().Value();
    } else {
        g_debugMode = false;
    }

    // The log handler is already set during module initialization
    Devices::get();
    return Napi::Number::New(env, 0);
}

Napi::Value DeInitSDK(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Devices::get().close();
    // int result = dev_sdk_exit(); // This function does not exist.
    g_deviceWrappers.clear();
    return Napi::Number::New(env, 0);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    // Set the custom log handler IMMEDIATELY during module load
    // This ensures it's in place before any SDK initialization
    dev_set_log_handler(CustomLogHandler, nullptr);

    exports.Set("initSDK", Napi::Function::New(env, InitSDK));
    exports.Set("deinitSDK", Napi::Function::New(env, DeInitSDK));
    exports.Set("getDevList", Napi::Function::New(env, GetDevList));
    exports.Set("setDevChangedCallback", Napi::Function::New(env, SetDevChangedCallback));
    DeviceWrap::Init(env, exports);
    return exports;
}

NODE_API_MODULE(obsbot_native, Init)