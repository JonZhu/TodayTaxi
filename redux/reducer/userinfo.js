/**
 * 用户信息
 * 
 * {
 *  userId: 用户id,
 *  phone: 电话,
 *  motorman: 是否为司机,
 *  nickname: 昵称
 * }
 * 
 * @param {*} preStatus 
 * @param {*} action 
 */

function userinfo(preStatus = {}, action) {
    if (action.type == 'userLogin') {
        var loginResp = action.loginResp;
        return {...preStatus, userId:loginResp.userId, motorman:loginResp.motorman, nickname:loginResp.nickname, phone:loginResp.phone}
    } else {
        return preStatus
    }
}

export default userinfo;