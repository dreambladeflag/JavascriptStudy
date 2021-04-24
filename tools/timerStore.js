/**
*定时器管理类
*/
class TimerStore {
	
	// 定时器管理器状态表
	static STATE = {
		ACTIVE: true,
		DE_ACTIVE: false
	}
	
	/**
	*构造函数
	*@return {TimerStore} 定时器管理类实例
	*/
	constructor () {
		this._store = new Map(); // 定时器列表
		this._isActive = TimerStore.STATE.ACTIVE; // 定时器管理器活动状态
	}
	
	/**
	*切换定时器管理器的活动状态
	*@param {Boolean} state 定时器管理器的活动状态
	*@return {TimerStore}
	*/
	switchState (state) {
		this._isActive = state;
		
		return this;
	}
	
	/**
	*获取定时器管理器的活动状态
	*@return {Boolean}
	*/
	getState () {
		return this._isActive;
	}
	
	/**
	*添加一个定时器
	*@param {Number} 定时器Id
	*@return {Number}
	*/
	addTimer (timer) {
		this._store.set(timer.uid, timer);
		
		if (this._isActive) {
			timer.start(); // 如果定时器管理器的活动状态是活动，启用定时器
		}
		
		return timer.uid;
	}
	
	/**
	*移除一个定时器
	*@param {Number} 定时器Id
	*@return {TimerStore}
	*/
	removeTimer (timerId) {
		const timer = this._store.get(timerId);
		
		if (this._isActive) {
			timer.stop();
		}
		
		this._store.delete(timerId);
		
		return timer.uid;
	}
	
	/**
	*启用一个定时器
	*@param {Number} 定时器Id
	*@return {TimerStore}
	*/
	startTimer (timerId) {
		if (this._isActive) {
			this._store.get(timerId).start();
		}
		
		return this;
	}
	
	/**
	*暂停一个定时器
	*@param {Number} 定时器Id
	*@return {TimerStore}
	*/
	suspendTimer (timerId) {
		this._store.get(timerId).suspend();
		
		return this;
	}
	
	/**
	*停止一个定时器
	*@param {Number} 定时器Id
	*@return {TimerStore}
	*/
	stopTimer (timerId) {
		this._store.get(timerId).stop();
		
		return this;
	}
	
	/**
	*启用所有定时器
	*@return {TimerStore}
	*/
	startTimers () {
		if (this._isActive) {
			this._store.forEach(timer => timer.start());
		}
		
		return this;
	}
	
	/**
	*暂停所有定时器
	*@return {TimerStore}
	*/
	suspendTimers () {
		this._store.forEach(timer => timer.suspend());
		
		return this;
	}
	
	/**
	*停止所有定时器
	*@return {TimerStore}
	*/
	stopTimers () {
		this._store.forEach(timer => timer.stop());
		
		return this;
	}
	
	/**
	*清空所有定时器
	*@return {TimerStore}
	*/
	clearTimers () {
		if (this._isActive) {
			this._store.forEach(timer => timer.stop());
		}
		
		this._store.clear();
		this._isActive = false; // 将定时器管理器状态设置为未活动
		
		return this;
	}

}
