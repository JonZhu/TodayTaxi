/**
 * 地图API
 * 
 * @author zhujun
 * @date 2016-12-28
 * 
 * <p>
 * 反向地理编码
 * void reverseGeoCode(double lng, double lat, final Promise promise)
 * </p>
 * 
 */

import { NativeModules } from 'react-native';

const MapModule = NativeModules.ReactBaiduMapModule;

export default MapModule;