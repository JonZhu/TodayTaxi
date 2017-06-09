/**
 * 用户异常码
 * 
 * @author zhujun
 * @date 2017-6-7
 */

export default UserExceptionCode = {

	/**
	 * 电话指定的用户已经存在
	 */
	PHONE_EXIST: 1000,
	
	/**
	 * 用户不存在
	 */
	USER_NOT_EXIST: 1001,
	
	/**
	 * 密码不正确
	 */
	PASSWORD_INCORRECT: 1002,

	/**
	 * 验证码错误
	 */
	VERIFY_CODE_ERROR: 1003,

		/**
	 * 第三方帐号已存在
	 */
	THIRD_ACCOUNT_EXIST: 1004,

	/**
	 * 不支持的第三方类型
	 */
	THIRD_TYPE_ERROR: 1005,
	
}