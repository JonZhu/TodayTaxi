package com.todaytaxi.map;

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
                        promise.reject("1", "Can't reverse geo code");
                    }
                }
            });

            ReverseGeoCodeOption option = new ReverseGeoCodeOption();
            option.location(new LatLng(lat, lng));
            geoCoder.reverseGeoCode(option);
        } catch (Exception e) {
            promise.reject(e);
        } finally {
            geoCoder.destroy();
        }

    }

}
