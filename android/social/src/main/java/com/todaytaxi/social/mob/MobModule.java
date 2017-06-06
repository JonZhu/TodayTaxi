package com.todaytaxi.social.mob;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.concurrent.atomic.AtomicBoolean;

import cn.smssdk.SMSSDK;

/**
 * Created by zhujun on 2017/6/5.
 */

public class MobModule extends ReactContextBaseJavaModule {

    /**
     * 是否初始化SDK
     */
    private static final AtomicBoolean INIT = new AtomicBoolean(false);

    /**
     * APP Key
     */
    private static final String AK = "1e6e4d8f63b70";

    /**
     * Secrit Key
     */
    private static final String SK = "fb774c9c77285a7ca5e7151f98241e4e";

    public MobModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "MobModule";
    }

    private void initSDK() {
        synchronized (INIT) {
            if (!INIT.get()) {
                SMSSDK.initSDK(getReactApplicationContext(), AK, SK, SMSSDK.InitFlag.DISABLE_CONTACT);
                INIT.set(true);
            }
        }
    }

    /**
     * 下发验证码
     * @param phone
     * @param promise
     */
    @ReactMethod
    public void sendVerificationCode(String phone, Promise promise) {
        try {
            initSDK();
            SMSSDK.getVerificationCode("86", phone);
            promise.resolve(0);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

}
