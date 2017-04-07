package com.todaytaxi.map.util;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Created by zhujun on 2017/4/7.
 */

public class JSModuleUtil {

    /**
     * 发送事件到js端
     *
     * @param reactContext
     * @param eventName
     * @param eventData
     */
    public static void sendEvent(ReactContext reactContext, String eventName, ReadableMap eventData) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, eventData);
    }

}
