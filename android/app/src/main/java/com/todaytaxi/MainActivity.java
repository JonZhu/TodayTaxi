package com.todaytaxi;

import android.content.Intent;

import com.facebook.react.ReactActivity;
import com.tencent.connect.common.Constants;
import com.tencent.tauth.Tencent;
import com.todaytaxi.social.tencent.TencentModule;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "TodayTaxi";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        // 处理qq登录回调
        if (requestCode == Constants.REQUEST_LOGIN && TencentModule.LOGIN_LISTENER != null) {
            Tencent.onActivityResultData(requestCode, resultCode, data, TencentModule.LOGIN_LISTENER);
        }

        super.onActivityResult(requestCode, resultCode, data);
    }
}
