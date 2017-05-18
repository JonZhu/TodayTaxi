/**
 * 地图API
 * 
 * @author zhujun
 * @date 2016-12-28
 * 
 * <p>
 * 反向地理编码
 * void reverseGeoCode(double lng, double lat, final Promise promise) <br/>
 * 
 * 地理编码
 * void geoCode(String city, String address, final Promise promise) <br/>
 * 
 * 在城市中搜索POI
 * void searchInCity(String city, String keyword, int dataLimit, final Promise promise) <br/>
 * 
 * 定位当前位置, 只定位一次
 * void location(final Promise promise) <br/>
 * 返回：{
 *  lat,
 *  lng,
 *  direction,
 *  speed,
 *  city,
 *  cityCode,
 *  country,
 *  address,
 *  district,
 *  describe
 * }
 * 
 * 开始定位, 用于连续定位
 * void startLocation(params) <br/>
 * params: {
 *  interval:发起定位请求的时间间隔，单位毫秒, 默认2000,
 *  needAddress:是否需要详细地址, 默认true
 * }
 * 
 * 
 * 停止startLocation方法开启的定位
 * void stopLocation()
 * 
 * 驾车路线规划
 * void drivingRoute(ReadableMap from, ReadableMap go, final Promise promise) <br/>
 * 返回： [{title, distance, duration, lightNum}]
 * 
 * </p>
 * 
 */

import { NativeModules, NativeEventEmitter } from 'react-native';

const MapModule = NativeModules.ReactBaiduMapModule;

/**
 * 添加定位改变监听器
 * @param listener = (loc)=>{}, loc数据结构在location方法返回基础上，增加errorCode、errorInfo
 *  当errorCode为0时，表示本次定位成功
 * @return EmitterSubscription 用于清除监听器，使用remove()方法
 */
function addLocChangedListener(listener) {
    return NativeEventEmitter.addListener('onLocChanged', listener);
}

export default MapModule;
export {addLocChangedListener};