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

import { NativeModules } from 'react-native';

const NaviModule = NativeModules.AmapNaviModule;

export default NaviModule;