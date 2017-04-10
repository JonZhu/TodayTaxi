/**
 * 导航API
 * 
 * @author zhujun
 * @date 2017-4-7
 * 
 * <p>
 * 开始导航
 * void startNavi(ReadableArray pointList, final Promise promise)
 * pointList 点列表，第一个为起点，最后一个为终点，其它的为途经点, [{lat:纬度, lng:经度}]
 * 
 * 停止导航
 * void stopNavi()
 * </p>
 * 
 */

import { NativeModules, NativeEventEmitter } from 'react-native';

const NaviModule = NativeModules.AmapNaviModule;

/**
 * 添加导航定位改变事件监听
 * @param {*} listener (event)=>{}
 * event: {lng, lat, time:时间毫秒, speed:公里每小时, direction:相对正北方向逆时针的角度}
 * @return EmitterSubscription
 */
function addNaviLocChangeListener(listener) {
    return NativeEventEmitter.addListener('onNaviLocChange', listener);
}

/**
 * 添加导航到达终点事件监听
 * @param {*} listener (event)=>{}
 * event: null
 * @return EmitterSubscription
 */
function addNaviArriveDestListener(listener) {
    return NativeEventEmitter.addListener('onNaviArriveDest', listener);
}

/**
 * 添加导航到达途经点事件监听
 * @param {*} listener (event)=>{}
 * event: {wayPointId:途经点id}
 * @return EmitterSubscription
 */
function addNaviArriveWayPointListener(listener) {
    return NativeEventEmitter.addListener('onNaviArriveWayPoint', listener);
}


export default NaviModule;
export {addNaviLocChangeListener, addNaviArriveDestListener, addNaviArriveWayPointListener};