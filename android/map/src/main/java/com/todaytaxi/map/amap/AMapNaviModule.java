package com.todaytaxi.map.amap;

import com.amap.api.navi.AMapNavi;
import com.amap.api.navi.AMapNaviListener;
import com.amap.api.navi.enums.NaviType;
import com.amap.api.navi.model.AMapLaneInfo;
import com.amap.api.navi.model.AMapNaviCameraInfo;
import com.amap.api.navi.model.AMapNaviCross;
import com.amap.api.navi.model.AMapNaviInfo;
import com.amap.api.navi.model.AMapNaviLocation;
import com.amap.api.navi.model.AMapNaviTrafficFacilityInfo;
import com.amap.api.navi.model.AMapServiceAreaInfo;
import com.amap.api.navi.model.AimLessModeCongestionInfo;
import com.amap.api.navi.model.AimLessModeStat;
import com.amap.api.navi.model.NaviInfo;
import com.amap.api.navi.model.NaviLatLng;
import com.autonavi.tbt.TrafficFacilityInfo;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.todaytaxi.map.util.JSModuleUtil;
import com.todaytaxi.map.util.WritableMapUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * 高德 导航接口
 *
 * Created by zhujun on 2017/4/7.
 */

public class AMapNaviModule extends ReactContextBaseJavaModule {

    private static AMapNavi MAP_NAVI = null;

    public AMapNaviModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AmapNaviModule";
    }

    /**
     * 开始导航
     *
     * @param pointList 点列表，第一个为起点，最后一个为终点，其它的为途经点, [{lat:纬度, lng:经度}]
     * @param promise
     */
    @ReactMethod
    public void startNavi(ReadableArray pointList, final Promise promise) {
        stopNavi(); // 停止之前的导航

        if (pointList == null || pointList.size() < 2) {
            throw new RuntimeException("pointList不能少于2个点");
        }

        final List<NaviLatLng> startList = new ArrayList<>(1); // 起点
        final List<NaviLatLng> wayList = new ArrayList<>(3); // 途经点
        final List<NaviLatLng> endList = new ArrayList<>(1); // 终点
        for (int i = 0; i < pointList.size(); i++) {
            NaviLatLng latLng = WritableMapUtil.toLatLng(pointList.getMap(i));
            if (i == 0) {
                startList.add(latLng);
            } else if (i == pointList.size() - 1) {
                endList.add(latLng);
            } else {
                wayList.add(latLng);
            }
        }

        final AMapNavi mapNavi = AMapNavi.getInstance(getReactApplicationContext());

        mapNavi.addAMapNaviListener(new AMapNaviListener() {
            @Override
            public void onInitNaviFailure() {
                promise.reject("1", "InitNaviFailure");
            }

            @Override
            public void onInitNaviSuccess() {
                /**
                 * 方法:
                 *   int strategy=mAMapNavi.strategyConvert(congestion, avoidhightspeed, cost, hightspeed, multipleroute);
                 * 参数:
                 * @congestion 躲避拥堵
                 * @avoidhightspeed 不走高速
                 * @cost 避免收费
                 * @hightspeed 高速优先
                 * @multipleroute 多路径
                 *
                 * 说明:
                 *      以上参数都是boolean类型，其中multipleroute参数表示是否多条路线，如果为true则此策略会算出多条路线。
                 * 注意:
                 *      不走高速与高速优先不能同时为true
                 *      高速优先与避免收费不能同时为true
                 */
                int strategy = mapNavi.strategyConvert(true, false, false, false, false);
                // calculateDriveRoute(java.util.List<NaviLatLng> from, java.util.List<NaviLatLng> to, java.util.List<NaviLatLng> wayPoints, int strategy)
                boolean success = mapNavi.calculateDriveRoute(startList, endList, wayList, strategy);
                if (!success) {
                    promise.reject("3", "calculateDriveRouteFail");
                }
            }

            @Override
            public void onStartNavi(int i) {

            }

            @Override
            public void onTrafficStatusUpdate() {

            }

            /**
             * 当GPS位置有更新时的回调函数
             * @param aMapNaviLocation
             */
            @Override
            public void onLocationChange(AMapNaviLocation aMapNaviLocation) {
                // 发送导航定位改变事件
                WritableMap data = Arguments.createMap();
                WritableMapUtil.put(data, aMapNaviLocation);
                JSModuleUtil.sendEvent(getReactApplicationContext(), "onNaviLocChange", data);
            }

            @Override
            public void onGetNavigationText(int i, String s) {

            }

            @Override
            public void onGetNavigationText(String s) {

            }

            @Override
            public void onEndEmulatorNavi() {

            }

            /**
             * 到达目的地后回调函数
             */
            @Override
            public void onArriveDestination() {
                JSModuleUtil.sendEvent(getReactApplicationContext(), "onNaviArriveDest", null);
            }

            /**
             *
             * @param errorCode PathPlanningErrCode
             */
            @Override
            public void onCalculateRouteFailure(int errorCode) {
                promise.reject("4", "onCalculateRouteFailure");
            }

            @Override
            public void onReCalculateRouteForYaw() {

            }

            @Override
            public void onReCalculateRouteForTrafficJam() {

            }

            /**
             * 驾车路径导航到达某个途经点的回调函数
             * @param wayID
             */
            @Override
            public void onArrivedWayPoint(int wayID) {
                WritableMap data = Arguments.createMap();
                data.putInt("wayPointId", wayID);
                JSModuleUtil.sendEvent(getReactApplicationContext(), "onNaviArriveWayPoint", data);
            }

            @Override
            public void onGpsOpenStatus(boolean b) {

            }

            @Override
            public void onNaviInfoUpdate(NaviInfo naviInfo) {

            }

            @Override
            public void onNaviInfoUpdated(AMapNaviInfo aMapNaviInfo) {

            }

            @Override
            public void updateCameraInfo(AMapNaviCameraInfo[] aMapNaviCameraInfos) {

            }

            @Override
            public void onServiceAreaUpdate(AMapServiceAreaInfo[] aMapServiceAreaInfos) {

            }

            @Override
            public void showCross(AMapNaviCross aMapNaviCross) {

            }

            @Override
            public void hideCross() {

            }

            @Override
            public void showLaneInfo(AMapLaneInfo[] aMapLaneInfos, byte[] bytes, byte[] bytes1) {

            }

            @Override
            public void hideLaneInfo() {

            }

            @Override
            public void onCalculateRouteSuccess(int[] ints) {
                // 路径规则成功, 开启GPS实时导航
                boolean success = mapNavi.startNavi(NaviType.GPS);
                if (success) {
                    promise.resolve(null);
                } else {
                    promise.reject("2", "startNaviFail");
                }
            }

            @Override
            public void notifyParallelRoad(int i) {

            }

            @Override
            public void OnUpdateTrafficFacility(AMapNaviTrafficFacilityInfo aMapNaviTrafficFacilityInfo) {

            }

            @Override
            public void OnUpdateTrafficFacility(AMapNaviTrafficFacilityInfo[] aMapNaviTrafficFacilityInfos) {

            }

            @Override
            public void OnUpdateTrafficFacility(TrafficFacilityInfo trafficFacilityInfo) {

            }

            @Override
            public void updateAimlessModeStatistics(AimLessModeStat aimLessModeStat) {

            }

            @Override
            public void updateAimlessModeCongestionInfo(AimLessModeCongestionInfo aimLessModeCongestionInfo) {

            }

            @Override
            public void onPlayRing(int i) {

            }
        });

        MAP_NAVI = mapNavi;
    }

    /**
     * 停止导航
     */
    @ReactMethod
    public void stopNavi() {
        if (MAP_NAVI != null) {
            MAP_NAVI.stopNavi();
            MAP_NAVI.destroy();
            MAP_NAVI = null;
        }
    }

}
