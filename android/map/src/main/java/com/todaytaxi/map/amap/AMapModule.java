package com.todaytaxi.map.amap;

import android.util.Log;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.amap.api.services.core.LatLonPoint;
import com.amap.api.services.core.PoiItem;
import com.amap.api.services.geocoder.GeocodeAddress;
import com.amap.api.services.geocoder.GeocodeQuery;
import com.amap.api.services.geocoder.GeocodeResult;
import com.amap.api.services.geocoder.GeocodeSearch;
import com.amap.api.services.geocoder.RegeocodeAddress;
import com.amap.api.services.geocoder.RegeocodeQuery;
import com.amap.api.services.geocoder.RegeocodeResult;
import com.amap.api.services.poisearch.PoiResult;
import com.amap.api.services.poisearch.PoiSearch;
import com.amap.api.services.route.BusRouteResult;
import com.amap.api.services.route.DrivePath;
import com.amap.api.services.route.DriveRouteResult;
import com.amap.api.services.route.RideRouteResult;
import com.amap.api.services.route.RouteSearch;
import com.amap.api.services.route.WalkRouteResult;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.todaytaxi.map.util.JSModuleUtil;
import com.todaytaxi.map.util.WritableMapUtil;

import java.util.List;

/**
 * 地图API
 *
 * Created by zhujun on 2016/12/28.
 */

public class AMapModule extends ReactContextBaseJavaModule {

    private final static String LOG_TAG = AMapModule.class.getSimpleName();

    /**
     * 连续定位客户端
     */
    private static AMapLocationClient LOCATION_CLIENT;

    public AMapModule(ReactApplicationContext reactContext) {
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
        GeocodeSearch search = new GeocodeSearch(getReactApplicationContext());
        search.setOnGeocodeSearchListener(new GeocodeSearch.OnGeocodeSearchListener() {

            /**
             * @param regeocodeResult
             * @param code 返回结果成功或者失败的响应码。1000为成功，其他为失败
             */
            @Override
            public void onRegeocodeSearched(RegeocodeResult regeocodeResult, int code) {
                if (code == 1000) {
                    // 成功
                    RegeocodeAddress geoAddress = regeocodeResult.getRegeocodeAddress();
                    WritableMap map = Arguments.createMap();
                    WritableMapUtil.put(map, geoAddress);
                    Log.d(LOG_TAG, "reverse geo code result: " + geoAddress.getFormatAddress());
                    promise.resolve(map);
                } else {
                    Log.e(LOG_TAG, "Can't reverse geo code");
                    promise.reject("2", "Can't reverse geo code");
                }
            }

            @Override
            public void onGeocodeSearched(GeocodeResult geocodeResult, int i) {

            }
        });
        RegeocodeQuery query = new RegeocodeQuery(new LatLonPoint(lat, lng), 200, GeocodeSearch.AMAP);
        search.getFromLocationAsyn(query);
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
        GeocodeSearch search = new GeocodeSearch(getReactApplicationContext());
        search.setOnGeocodeSearchListener(new GeocodeSearch.OnGeocodeSearchListener() {
            @Override
            public void onRegeocodeSearched(RegeocodeResult regeocodeResult, int i) {

            }

            @Override
            public void onGeocodeSearched(GeocodeResult geocodeResult, int code) {
                if (code == 1000) {
                    // 成功
                    Log.d(LOG_TAG, "geo code result");
                    WritableMap map = null;
                    List<GeocodeAddress> addressList = geocodeResult.getGeocodeAddressList();
                    if (!addressList.isEmpty()) {
                        map = Arguments.createMap();
                        WritableMapUtil.put(map, addressList.get(0));
                    }
                    promise.resolve(map);
                } else {
                    Log.e(LOG_TAG, "Can't geo code");
                    promise.reject("2", "Can't geo code");
                }
            }
        });

        GeocodeQuery query = new GeocodeQuery(address, city);
        search.getFromLocationNameAsyn(query);
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
        PoiSearch.Query query = new PoiSearch.Query(keyword, "", city);
        query.setPageSize(20);
        query.setCityLimit(true);
        PoiSearch search = new PoiSearch(getReactApplicationContext(), query);
        search.setOnPoiSearchListener(new PoiSearch.OnPoiSearchListener() {
            @Override
            public void onPoiSearched(PoiResult poiResult, int code) {
                if (code == 1000) {
                    Log.d(LOG_TAG, "searchInCity result");
                    WritableArray data = null;
                    List<PoiItem> poiItemList = poiResult.getPois();
                    if (poiItemList != null && !poiItemList.isEmpty()) {
                        PoiItem poiItem = null;
                        WritableMap map = null;
                        data = Arguments.createArray();
                        for (int i = 0; i < poiItemList.size(); i++) {
                            poiItem = poiItemList.get(i);
                            if (poiItem.getLatLonPoint() == null) {
                                // 不返回无坐标数据
                                continue;
                            }
                            map = Arguments.createMap();
                            WritableMapUtil.put(map, poiItem);
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
            public void onPoiItemSearched(PoiItem poiItem, int i) {

            }
        });

        search.searchPOIAsyn();
    }


    /**
     * 定位当前位置, 只定位一次
     */
    @ReactMethod
    public void location(final Promise promise) {
        final AMapLocationClient locationClient = new AMapLocationClient(getReactApplicationContext());
        AMapLocationClientOption option = new AMapLocationClientOption();
        option.setOnceLocation(true);
        option.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);
        option.setNeedAddress(true);
        option.setMockEnable(false);
        option.setHttpTimeOut(10000);
        locationClient.setLocationOption(option);

        locationClient.setLocationListener(new AMapLocationListener() {
            @Override
            public void onLocationChanged(AMapLocation aMapLocation) {
                locationClient.stopLocation();
                locationClient.onDestroy();
                //可以判断AMapLocation对象不为空，当定位错误码类型为0时定位成功
                if (aMapLocation.getErrorCode() == 0) {
                    // 定位成功
                    Log.d(LOG_TAG, "location success, Latitude:"+ aMapLocation.getLatitude()
                            +", Longitude:" + aMapLocation.getLongitude() + ", AddrStr:" + aMapLocation.getAddress());

                    WritableMap map = Arguments.createMap();
                    WritableMapUtil.put(map, aMapLocation);

                    promise.resolve(map);
                } else {
                    Log.d(LOG_TAG, "location fail:" + aMapLocation.getErrorInfo());
                    promise.reject("1", "location fail:" + aMapLocation.getErrorInfo());
                }
            }
        });

        locationClient.startLocation();
    }

    /**
     * 开始定位, 适用于连续定位
     *
     * @param params {
     *               interval:发起定位请求的时间间隔，单位毫秒, 默认2000,
     *               needAddress:是否需要详细地址, 默认true
     *               }
     */
    @ReactMethod
    public void startLocation(ReadableMap params) {
        synchronized (AMapModule.class) {
            if (LOCATION_CLIENT != null) {
                return;
            }

            LOCATION_CLIENT = new AMapLocationClient(getReactApplicationContext());
        }

        AMapLocationClientOption option = new AMapLocationClientOption();
        option.setOnceLocation(false);
        option.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);
        option.setMockEnable(false);
        option.setHttpTimeOut(10000);
        if (params != null) {
            Dynamic dynamic = params.getDynamic("needAddress");
            if (!dynamic.isNull()) {
                option.setNeedAddress(dynamic.asBoolean());
            }
            dynamic = params.getDynamic("interval");
            if (!dynamic.isNull()) {
                option.setInterval(dynamic.asInt());
            }
        }
        LOCATION_CLIENT.setLocationOption(option);

        LOCATION_CLIENT.setLocationListener(new AMapLocationListener() {
            @Override
            public void onLocationChanged(AMapLocation aMapLocation) {
                //可以判断AMapLocation对象不为空，当定位错误码类型为0时定位成功
                WritableMap map = Arguments.createMap();
                map.putInt("errorCode", aMapLocation.getErrorCode());
                if (aMapLocation.getErrorCode() == 0) {
                    // 定位成功
                    Log.d(LOG_TAG, "location success, Latitude:"+ aMapLocation.getLatitude()
                            +", Longitude:" + aMapLocation.getLongitude() + ", AddrStr:" + aMapLocation.getAddress());


                    WritableMapUtil.put(map, aMapLocation);
                } else {
                    Log.d(LOG_TAG, "location fail:" + aMapLocation.getErrorInfo());
                    map.putString("errorInfo", aMapLocation.getErrorInfo());
                }

                // 触发onLocChanged到js端
                JSModuleUtil.sendEvent(getReactApplicationContext(), "onLocChanged", map);
            }
        });

        LOCATION_CLIENT.startLocation();
    }

    /**
     * 停止连续定位
     */
    @ReactMethod
    public void stopLocation() {
        synchronized (AMapModule.class) {
            if (LOCATION_CLIENT != null) {
                LOCATION_CLIENT.stopLocation();
                LOCATION_CLIENT.onDestroy();
                LOCATION_CLIENT = null;
            }
        }
    }

    /**
     * 驾车路线规划
     *
     * @param from
     * @param go
     * @param promise
     */
    @ReactMethod
    public void drivingRoute(ReadableMap from, ReadableMap go, final Promise promise) {
        final RouteSearch search = new RouteSearch(getReactApplicationContext());
        search.setRouteSearchListener(new RouteSearch.OnRouteSearchListener() {
            @Override
            public void onBusRouteSearched(BusRouteResult busRouteResult, int i) {

            }

            /**
             * @param driveRouteResult
             * @param code 返回结果成功或者失败的响应码。1000为成功
             */
            @Override
            public void onDriveRouteSearched(DriveRouteResult driveRouteResult, int code) {
                if (code == 1000) {
                    WritableArray arr = null;
                    List<DrivePath> pathList = driveRouteResult.getPaths();
                    if (pathList != null && !pathList.isEmpty()) {
                        arr = Arguments.createArray();
                        for (DrivePath path : pathList) {
                            WritableMap map = Arguments.createMap();
                            WritableMapUtil.put(map, path);
                            arr.pushMap(map);
                        }
                    }

                    promise.resolve(arr);
                } else {
                    promise.reject("1", "drivingRoute error, code:" + code);
                }
            }

            @Override
            public void onWalkRouteSearched(WalkRouteResult walkRouteResult, int i) {

            }

            @Override
            public void onRideRouteSearched(RideRouteResult rideRouteResult, int i) {

            }
        });

        RouteSearch.FromAndTo fromAndTo = new RouteSearch.FromAndTo(
                new LatLonPoint(from.getDouble("lat"), from.getDouble("lng")),
                new LatLonPoint(go.getDouble("lat"), go.getDouble("lng")));
        RouteSearch.DriveRouteQuery query = new RouteSearch.DriveRouteQuery(fromAndTo,
                RouteSearch.DRIVING_SINGLE_DEFAULT, null, null, null);
        search.calculateDriveRouteAsyn(query);
    }

}
