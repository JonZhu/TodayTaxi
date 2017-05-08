/**
 * 行程状态常量
 * 
 * @author zhujun
 * @date 2017-5-8
 */

export default RouteStatus = {

	/**
	 * 未开始
	 */
	UN_START: 0,
	
	/**
	 * 开始叫车
	 */
	START: 1,
	
	/**
	 * 已适配
	 */
	ALLOCATED: 11,
	
	/**
	 * 司机取消
	 */
	MOTORMAN_CANCEL: 20,
	
	/**
	 * 乘客取消
	 */
	PASSENGER_CANCEL: 21,
	
	/**
	 * 叫车超时
	 */
	CALL_TIMEOUT: 22,
	
	/**
	 * 司机到达乘车点
	 */
	TAXI_ARRIVED: 30,
	
	/**
	 * 乘客已上车
	 */
	PASSENGER_GETON: 31,
	
	/**
	 * 完成
	 */
	COMPLETE: 40,
}