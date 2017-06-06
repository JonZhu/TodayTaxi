/**
 * Mob API
 * 
 * @author zhujun
 * @date 2017-6-6
 * 
 * <p>
 * 发送短信验证码
 * void sendVerificationCode(String phone, Promise promise)
 *
 * </p>
 * 
 */

import { NativeModules } from 'react-native';

const MobModule = NativeModules.MobModule;

export default MobModule;