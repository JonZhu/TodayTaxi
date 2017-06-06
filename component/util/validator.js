/**
 * 数据验证工具
 * @author zhujun
 * @date 2017-3-6
 */

/**
 * 验证手机号
 */
export function validatePhone(value) {
    if (typeof(value) != 'string') {
        return false;
    }
    var phoneReg = /^1[345678]\d{9}$/;
    return phoneReg.test(value);
}

/**
 * 验证密码
 */
export function validatePass(value) {
    if (typeof(value) != 'string') {
        return false;
    }

    var passReg = /^[\d_\w]{6,20}$/; // 6到20位数字、下划线、字母
    return passReg.test(value);
}