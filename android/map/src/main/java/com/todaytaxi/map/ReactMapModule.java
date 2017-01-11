package com.todaytaxi.map;

import android.util.Log;

import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.search.core.SearchResult;
import com.baidu.mapapi.search.geocode.GeoCodeResult;
import com.baidu.mapapi.search.geocode.GeoCoder;
import com.baidu.mapapi.search.geocode.OnGetGeoCoderResultListener;
import com.baidu.mapapi.search.geocode.ReverseGeoCodeOption;
import com.baidu.mapapi.search.geocode.ReverseGeoCodeResult;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * 地图API
 *
 * Created by zhujun on 2016/12/28.
 */

public class ReactMapModule extends ReactContextBaseJavaModule {

    private final static String LOG_TAG = ReactMapModule.class.getName();

    public ReactMapModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ReactBaiduMapModule";
    }

    /**
     * 反向地理编码
     *
     * @param lng 经度
     * @param lat 纬度
     */
    @ReactMethod
    public void reverseGeoCode(double lng, double lat, final Promise promise) {
        Log.d(LOG_TAG, "Start reverseGeoCode, lng:"+ lng +", lat:"+ lat);
        GeoCoder geoCoder = GeoCoder.newInstance();
        try {
            geoCoder.setOnGetGeoCodeResultListener(new OnGetGeoCoderResultListener() {
                @Override
                public void onGetGeoCodeResult(GeoCodeResult geoCodeResult) {

                }

                @Override
                public void onGetReverseGeoCodeResult(ReverseGeoCodeResult result) {
                    if (result != null && result.error == SearchResult.ERRORNO.NO_ERROR) {
                        promise.resolve(result.getAddress());
                    } else {
                        Log.e(LOG_TAG, "Can't reverse geo code");
                        promise.reject("2", "Can't reverse geo code");
                    }
                }
            });

            ReverseGeoCodeOption option = new ReverseGeoCodeOption();
            option.location(new LatLng(lat, lng));
            geoCoder.reverseGeoCode(option);
        } catch (Exception e) {
            Log.e(LOG_TAG, "reverseGeoCode error", e);
            promise.reject("1", e);
        } finally {
            geoCoder.destroy();
        }

    }

}
