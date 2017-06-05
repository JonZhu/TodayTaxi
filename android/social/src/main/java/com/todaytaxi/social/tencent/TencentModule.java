package com.todaytaxi.social.tencent;

import android.content.res.Resources;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.tencent.connect.UserInfo;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;
import com.todaytaxi.social.R;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by zhujun on 2017/6/5.
 */

public class TencentModule extends ReactContextBaseJavaModule {

    private static Tencent TENCENT;

    public TencentModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "TencentModule";
    }


    private Tencent getTencent() {
        synchronized (TencentModule.class) {
            if (TENCENT == null) {
                ReactApplicationContext context = getReactApplicationContext();
                Resources res = context.getResources();
                TENCENT = Tencent.createInstance(res.getString(R.string.tencent_appid), context);
            }
        }

        return TENCENT;
    }

    /**
     * QQ登录
     *
     * @return {
     *      status:状态 success为成功 cancel为取消,
     *      openID:用户openID
     * }
     *
     */
    @ReactMethod
    public void login(final Promise promise) {
        final Tencent tencent = getTencent();
        tencent.login(getCurrentActivity(), "all", new IUiListener() {
            @Override
            public void onComplete(Object o) {
                JSONObject json = (JSONObject)o;
                if (json != null) {
                    try {
                        int ret = json.getInt("ret");
                        if (ret == 0) {
                            // 登录成功
                            String openID = json.getString("openid");
                            String accessToken = json.getString("access_token");
                            String expires = json.getString("expires_in");
                            tencent.setOpenId(openID);
                            tencent.setAccessToken(accessToken, expires);

                            WritableMap map = Arguments.createMap();
                            map.putString("openID", openID);
                            map.putString("status", "success");
                            promise.resolve(map);
                        } else {
                            promise.reject(String.valueOf(ret), "登录失败");
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                        promise.reject(e);
                    }
                } else {
                    promise.reject("1", "返回数据为null");
                }
            }

            @Override
            public void onError(UiError uiError) {
                promise.reject("1", uiError.errorDetail);
            }

            @Override
            public void onCancel() {
                WritableMap map = Arguments.createMap();
                map.putString("status", "cancel");
                promise.resolve(map);
            }
        });
    }

    /**
     * 获取用户信息
     * @param promise
     * @return {
     *     nickname:昵称,
     *     figureurl:头像,
     *     gender:性别
     * }
     */
    @ReactMethod
    public void getInfo(final Promise promise) {
        final Tencent tencent = getTencent();
        UserInfo userInfo = new UserInfo(getCurrentActivity(), tencent.getQQToken());
        userInfo.getUserInfo(new IUiListener() {
            @Override
            public void onComplete(Object o) {
                JSONObject json = (JSONObject)o;
                try {
                    int ret = json.getInt("ret");
                    if (ret != 0) {
                        promise.reject(String.valueOf(ret), json.getString("msg"));
                        return;
                    }

                    String nickname = json.getString("nickname");
                    String figureurl = json.has("figureurl_qq_2") ? json.getString("figureurl_qq_2") :
                            json.getString("figureurl_qq_1");
                    String gender = json.getString("gender");

                    WritableMap map = Arguments.createMap();
                    map.putString("nickname", nickname);
                    map.putString("figureurl", figureurl);
                    map.putString("gender", gender);

                } catch (Exception e) {
                    promise.reject(e);
                }
            }

            @Override
            public void onError(UiError uiError) {
                promise.reject("1", uiError.errorDetail);
            }

            @Override
            public void onCancel() {

            }
        });
    }

}
