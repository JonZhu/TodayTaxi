package com.todaytaxi.map.util;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by zhujun on 2017/4/7.
 */

public class JSModuleUtil {

    /**
     * 发送全局事件到js端
     *
     * @param reactContext
     * @param eventName
     * @param eventData
     */
    public static void sendEvent(ReactContext reactContext, String eventName, ReadableMap eventData) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, eventData);
    }

    /**
     * 发送事件到js端ui组件，统一使用onChange接收, 再通过event.eventType 细分
     *
     * @param reactContext
     * @param uiId
     * @param event 事件, js端通过eventType细分事件
     */
    public static void sendUIEvent(ReactContext reactContext, int uiId, WritableMap event) {
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(uiId, "topChange", event);
    }

}
