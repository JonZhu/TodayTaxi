/**
 * 数据验证工具
 * @author zhujun
 * @date 2017-3-6
 */

/**
 * 验证手机号
 */
export function validatePhone(value) {
    if (!value instanceof String) {
        return false;
    }
    var phoneReg = /^1[345678]\d{9}$/;
    return value.match(phoneReg);
}

/**
 * 验证密码
 */
export function validatePass(value) {
    if (!value instanceof String) {
        return false;
    }

    var passReg = /^[\d_\w]{6,20}$/; // 6到20位数字、下划线、字母
    return value.match(passReg);
}