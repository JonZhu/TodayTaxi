/**
 * 公共异常码
 * 
 * <p>范围定义: 0 - 999</p>
 * 
 * @author zhujun
 * @date 2017年2月15日
 *
 */
export default CommonExceptionCode = {
    
    /**
     * 成功, 无异常
     */
    SUCCESS: 0,
    
    /**
     * 服务器未知异常
     */
    SERVER_UNKNOWN_ERROR: 500,
    
    /**
     * 签名验证异常
     */
    SIGN_ERROR: 333,

    /**
     * 无sessionId参数
     */
    SESSION_NO_PARAM: 334,
    
    /**
     * Session不存在或已超时
     */
    SESSION_TIMEOUT: 335
    
}