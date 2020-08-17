/**
*定时器行为组件
*TimerBehavior
*/
import Timer from './timer.js';
import TimerStore from './timerStore.js';

const timerBahavior = Behavior({
	
	// 定时器行为组件所在页面（组件）的生命周期
	pageLifetimes: {
		
		// 定时器行为所在页面展示
		show: function () {
			if (!this._timerStore.getState()) {
				this._timerStore.switchState(TimerStore.STATE.ACTIVE);
				this._timerStore.startTimers();
			}
		},
		
		// 定时器行为组件所在页面隐藏
		hide: function () {
			if (this._timerStore.getState()) {
				this._timerStore.switchState(TimerStore.STATE.DE_ACTIVE);
				this._timerStore.suspendTimers();
			}
		},
		
		// 定时器行为组件所在页面尺寸变化
		resize: function () {}
	},
	
	// 定时行为组件数据
	data: {
		_timerStore: null
	},
	
	// 定时器行为组件创建
	created: function () {
		this._timerStore = new TimerStore(); // 创建定时器管理器
	},
	
	// 定时器行为组件销毁
	detached: function () {
		this._timerStore.clear(); // 清空所有定时器
	},
	
	// 定时器行为组件方法
	methods: {
		
		$setTimeout: function (fn, interval, ...args) {
			const timer = new Timer(Timer.TYPE.TIMEOUT, fn, interval, ...args);
			
			return this._timerStore.addTimer(timer);
		},
		
		$setInterval: function (fn, interval, ...args) {
			const timer = new Timer(Timer.TYPE.INTERVAL, fn, interval, ...args);
			
			return this._timerStore.addTimer(timer);
		},
		
		$clearTimeout: function (id) {
			return this._timerStore.removeTimer(id);
		},
		
		$clearInterval: function (id) {
			return this._timerStore.removeTimer(id);
		}
	}
});

/**
* export { timeBehavior }; // 导出定时器行为组件
*/

/**
*某某组件使用TimerBavior行为
*/

/**
* import { timerBahavior } from './timerBahavior.js'; // 导入定时器行为组件
*/

Component({
	
	// 行为
	behaviors: [ timerBehavior ],
	
	// 属性列表（接收来自页面的数据）
	properties: {
		prop1: {
			type: String,
			value: ''
		}, // 标准写法
		prop2: String // 简写
	},
	
	// 组件数据（用于模板渲染）
	data: {},
	
	// 生命周期函数（优先级最高）
	lifetimes: {
		created: function () {},
		attached: function () {},
		ready: function () {},
		moved: function () {},
		detached: function () {}
	},

	// 生命周期函数
	created: function () {},
	attached: function () {},
	ready: function () {},
	moved: function () {},
	detached: function () {},
	
	// 组件所在页面的生命周期函数
	pageLifetimes: {
		show: function () {},
		hide: function () {},
		resize: function () {}
	},
	
	// 组件方法
	methods: {
		method1: function () {},
		method2: function () {}
	}
	
});


/**
* Behavior与Component的生命周期执行顺序
* Behavior.created()
* -> Component.created()
* -> Behavior.attached()
* -> Component.attached()
* -> Bahavior.ready()
* -> Component.ready()
*/

