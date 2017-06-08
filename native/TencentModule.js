/**
 * Tencent API
 * 
 * @author zhujun
 * @date 2017-6-8
 * 
 * <p>
 * qq登录
 * void login(final Promise promise)
 * 返回: {
 *  status: success|cancel,
 *  openID: tencentOpenId 在登录成功时返回
 * }
 * 
 * 获取用户信息, 在登录成功后使用
 * void getInfo(final Promise promise)
 * 返回：{
 *  nickname: 昵称,
 *  figureurl: 头像,
 *  gender: 性别, 男|女
 * }
 * 
 * </p>
 * 
 */

import { NativeModules } from 'react-native';

const TencentModule = NativeModules.TencentModule;

export default TencentModule;