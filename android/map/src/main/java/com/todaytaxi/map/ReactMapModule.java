package com.todaytaxi.map;

import android.util.Log;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.search.core.PoiInfo;
import com.baidu.mapapi.search.core.SearchResult;
import com.baidu.mapapi.search.geocode.GeoCodeOption;
import com.baidu.mapapi.search.geocode.GeoCodeResult;
import com.baidu.mapapi.search.geocode.GeoCoder;
import com.baidu.mapapi.search.geocode.OnGetGeoCoderResultListener;
import com.baidu.mapapi.search.geocode.ReverseGeoCodeOption;
import com.baidu.mapapi.search.geocode.ReverseGeoCodeResult;
import com.baidu.mapapi.search.poi.OnGetPoiSearchResultListener;
import com.baidu.mapapi.search.poi.PoiCitySearchOption;
import com.baidu.mapapi.search.poi.PoiDetailResult;
import com.baidu.mapapi.search.poi.PoiIndoorResult;
import com.baidu.mapapi.search.poi.PoiResult;
import com.baidu.mapapi.search.poi.PoiSearch;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.todaytaxi.map.util.WritableMapUtil;

import java.util.List;

/**
 * 地图API
 *
 * Created by zhujun on 2016/12/28.
 */

public class ReactMapModule extends ReactContextBaseJavaModule {

    private final static String LOG_TAG = ReactMapModule.class.getSimpleName();

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
        final GeoCoder geoCoder = GeoCoder.newInstance();
        try {
            geoCoder.setOnGetGeoCodeResultListener(new OnGetGeoCoderResultListener() {
                @Override
                public void onGetGeoCodeResult(GeoCodeResult result) {
                    Log.d(LOG_TAG, "geo code result: " + result.getAddress());
                    geoCoder.destroy();
                }

                @Override
                public void onGetReverseGeoCodeResult(ReverseGeoCodeResult result) {
                    geoCoder.destroy();
                    if (result != null && result.error == SearchResult.ERRORNO.NO_ERROR) {
                        Log.d(LOG_TAG, "reverse geo code result: " + result.getAddress());
                        promise.resolve(result.getAddress());
                    } else {
                        Log.e(LOG_TAG, "Can't reverse geo code");
                        promise.reject("2", "Can't reverse geo code");
                    }
                }
            });

            ReverseGeoCodeOption option = new ReverseGeoCodeOption();
            option.location(new LatLng(lat, lng));
            boolean flag = geoCoder.reverseGeoCode(option);
            if (flag == false) {
                Log.e(LOG_TAG, "authority fail");
                geoCoder.destroy();
            }
        } catch (Exception e) {
            geoCoder.destroy();
            Log.e(LOG_TAG, "reverseGeoCode error", e);
            promise.reject("1", e);
        }

    }


    /**
     * 地理编码
     *
     * @param city 城市
     * @param address 地址
     */
    @ReactMethod
    public void geoCode(String city, String address, final Promise promise) {
        Log.d(LOG_TAG, "Start reverseGeoCode, city:"+ city +", address:"+ address);
        final GeoCoder geoCoder = GeoCoder.newInstance();
        try {
            geoCoder.setOnGetGeoCodeResultListener(new OnGetGeoCoderResultListener() {
                @Override
                public void onGetGeoCodeResult(GeoCodeResult result) {
                    Log.d(LOG_TAG, "geo code result: " + result.getAddress());
                    geoCoder.destroy();

                    if (result != null && result.error == SearchResult.ERRORNO.NO_ERROR) {
                        Log.d(LOG_TAG, "geo code result");
                        WritableMap map = Arguments.createMap();
                        WritableMapUtil.put(map, result.getLocation());
                        promise.resolve(map);
                    } else {
                        Log.e(LOG_TAG, "Can't geo code");
                        promise.reject("2", "Can't geo code");
                    }
                }

                @Override
                public void onGetReverseGeoCodeResult(ReverseGeoCodeResult result) {
                    geoCoder.destroy();
                }
            });

            GeoCodeOption option = new GeoCodeOption();
            option.city(city);
            option.address(address);
            boolean flag = geoCoder.geocode(option);
            if (flag == false) {
                Log.e(LOG_TAG, "authority fail");
                geoCoder.destroy();
            }
        } catch (Exception e) {
            geoCoder.destroy();
            Log.e(LOG_TAG, "geoCode error", e);
            promise.reject("1", e);
        }

    }

    /**
     * POI搜索
     *
     * @param city 城市
     * @param keyword 关键字
     * @param dataLimit 数据量限制
     */
    @ReactMethod
    public void searchInCity(String city, String keyword, int dataLimit, final Promise promise) {
        final PoiSearch search = PoiSearch.newInstance();

        OnGetPoiSearchResultListener listener = new OnGetPoiSearchResultListener() {
            @Override
            public void onGetPoiResult(PoiResult result) {
                search.destroy();

                if (result != null && result.error == SearchResult.ERRORNO.NO_ERROR) {
                    Log.d(LOG_TAG, "searchInCity result");
                    WritableArray data = null;
                    List<PoiInfo> poiInfoList = result.getAllPoi();
                    if (poiInfoList != null && !poiInfoList.isEmpty()) {
                        PoiInfo poiInfo = null;
                        WritableMap map = null;
                        data = Arguments.createArray();
                        for (int i = 0; i < poiInfoList.size(); i++) {
                            poiInfo = poiInfoList.get(i);
                            if (poiInfo.location == null) {
                                // 不返回无坐标数据
                                continue;
                            }
                            map = Arguments.createMap();
                            WritableMapUtil.put(map, poiInfo);
                            data.pushMap(map);
                        }
                    }

                    promise.resolve(data);
                } else {
                    Log.e(LOG_TAG, "Can't searchInCity");
                    promise.reject("2", "Can't searchInCity");
                }
            }

            @Override
            public void onGetPoiDetailResult(PoiDetailResult poiDetailResult) {
                search.destroy();
            }

            @Override
            public void onGetPoiIndoorResult(PoiIndoorResult poiIndoorResult) {
                search.destroy();
            }
        };

        search.setOnGetPoiSearchResultListener(listener);
        PoiCitySearchOption option = new PoiCitySearchOption();
        option.city(city);
        option.keyword(keyword);
        option.pageCapacity(dataLimit);
        search.searchInCity(option);
    }


    /**
     * 定位当前位置
     */
    @ReactMethod
    public void location(final Promise promise) {
        LocationClientOption option = new LocationClientOption();
        option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);
        option.setCoorType("bd09ll");
        option.setScanSpan(1000);
        option.setIsNeedAddress(true);
        option.setIsNeedLocationDescribe(true);
        option.setOpenGps(true);
        option.setIgnoreKillProcess(false);
        option.setEnableSimulateGps(false);

        final LocationClient locationClient = new LocationClient(getReactApplicationContext());
        locationClient.setLocOption(option);

        locationClient.registerLocationListener(new BDLocationListener() {
            @Override
            public void onReceiveLocation(BDLocation bdLocation) {
                locationClient.stop();

                int locType = bdLocation.getLocType();
                if (locType == BDLocation.TypeGpsLocation || locType == BDLocation.TypeNetWorkLocation
                        || locType == BDLocation.TypeOffLineLocation) {
                    // 定位成功
                    Log.d(LOG_TAG, "location success, Latitude:"+ bdLocation.getLatitude()
                            +", Longitude:" + bdLocation.getLongitude() + ", AddrStr:" + bdLocation.getAddrStr());

                    WritableMap map = Arguments.createMap();
                    WritableMapUtil.put(map, bdLocation);

                    promise.resolve(map);
                } else {
                    Log.d(LOG_TAG, "location fail, locType:" + locType);
                    promise.reject("1", "location fail, locType:" + locType);
                }

            }
        });

        locationClient.start();
    }


}
