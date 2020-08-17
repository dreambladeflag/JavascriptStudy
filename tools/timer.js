/**
*定时器类
*/
class Timer {
	static count = 0;
	static TYPE = {
		TIMEOUT: 'timeout',
		INTERVAL: 'interval'
	};
	
	/**
	*构造函数
	*@param {String} type 定时器类型 可选 ['timeout'|'interval'] 默认 'timeout'
	*@param {Function} callback 回调函数 可选 默认为一个空函数
	*@param {Number} intervalTime 定时执行间隔时间 可选 默认为0
	*@param {Array} args 附加参数 可选 默认不带参数
	*@return {Timer} Timer实例
	*/
	constructor (type = Timer.TYPE.TIMEOUT, callback = () => {}, intervalTime = 0, ...args) {
		this.uid = ++Timer.count; // 每个定时器类uid
		this.callback = callback; // 回调函数
		this.intervalTime = intervalTime; // 定时执行间隔时间
		this.restIntervalTime = intervalTime; // 定时器剩余计时时间
		this.type = type; // 定时器类型
		this.args = args; // 附加参数
		this.timer = null; // 定时器实例
		this.lastTime = 0; // 上一次启用定时器的时间戳（毫秒数）
	}
	
	/**
	*启用定时器或重启定时器
	*@return {Boolean} 定时器开启状态（成功或失败）
	*/
	start () {
		let sussess = false; // 定时器启用状态
		this.lastTime = new Date().getTime(); // 记录本次启用定时器的时间戳（毫秒数）
		
		this.clear(); // 清除定时器，防止多个定时器同时运行
		
		switch (this.type) {
			
			case Timer.TYPE.TIMEOUT:
				this.timer = window.setTimeout(this.callback, this.restIntervalTime, ...this.args);
				success = true; // 定时器开启成功
				break;
				
			case Timer.TYPE.INTERVAL:
				this.timer = window.setTimeout(() => {
					this.callback(...this.args);
					this.timer = window.setInterval(this.callback, this.intervalTime, ...this.args);
				}, this.restIntervalTime);
				success = true; // 定时器开启成功
				break;
		}
		
		return success; // 返回定时器开启状态成功
	}
	
	/**
	*暂停定时器
	*@return {Boolean} 暂停定时器状态（成功或失败）
	*/
	suspend () {
		let success = false; // 暂停定时器状态（成功或失败）
		
		// 检查是否存在启用的定时器
		if (this.timer !== null) {
			this.clear(); // 清除定时器
			
			let currentTime = new Date().getTime(); // 获取当前时间戳
			let costTime = currentTime - this.lastTime; // 计算上一次启用定时器到本次暂停定时器所用的时间毫秒数
			let restTime = this.restIntervalTime - costTime; // 计算剩余计时时间与定时器运行时间的差值毫秒数
			
			switch (this.type) {
				
				case Timer.TYPE.TIMEOUT:
					this.restIntervalTime = restTime <= 0 ? 0 : restTime;
					break;
					
				case Timer.TYPE.INTERVAL:
					this.restIntervalTime = restTime < 0 ? this.restIntervalTime : restTime;
					break;
			}
			
			success = true;
		}
		
		return success;
	}
	
	/**
	*停止定时器
	*@return {Boolean} 停止定时器状态（成功或失败）
	*/
	stop () {
		let success = false; // 停止定时器状态（成功或失败）
		
		// 检查是否存在启用的定时器
		// 清除定时器
		// 重置剩余计时时间
		// 重置定时器启用时间
		if (this.timer !== null) {
			this.clear();
			
			this.restIntervalTime = this.intervalTime;
			this.lastTime = 0;
			
			success = true;
		}
		
		return success;
	}
	
	/**
	*清除定时器
	*/
	clear () {
		if (this.timer !== null) {
			clearTimeout(this.timer);
			clearInterval(this.timer);
			this.timer = null;
		}
	}
}

export default Timer;
