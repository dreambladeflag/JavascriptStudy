##### Vue注册组件的方式

1. 注册全局组件

   ```javascript
   // 使用Vue对象上的component方法注册全局组件
   Vue.component(组件名称, 组件实例);
   
   // 例：
   import xxxComponent from 'xxx'
   
   Vue.component('xxx', xxxComponent)
   ```

2. 注册局部组件

   ```javascript
   // 在组件内部的components属性上注册局部组件
   // 例:
   import xxxComponent from 'xxx'
   
   new Vue({
       el: '#app',
       components: {
           'xxx': xxxComponent
       },
       template: '<h1>APP</h1>'
   })
   ```

3. 使用插件的形式注册全局组件

   ``` javascript
   // 使用Vue.extend()方法创建一个组件构造器
   // 使用新创建的组件构造器new一个组件实例
   // 操作组件实例上的 $el属性 和 $mount()方法 将组件渲染到body节点下面
   // 例:
   import xxxComponent from 'xxx'
   
   const xxxConstructor = Vue.extend(xxxComponent)
   const xxx = new xxxConstructor()
   xxx.$mount(document.createElement('div'))
   document.body.appendChild(xxx.$el)
   Vue.prototype.$xxx = xxx
   
   // 注册后可以在任意组件内部通过 this.$xxx方式调用这个全局组件的方法和属性
   // this.$xxx.show()
   ```

   