##### VueRouter路由监听

1. 全局注册路由监听

   ```javascript
   // 监听全局中所有路由的跳转并进行拦截
   // 使用VueRouter对象实例的beforeEach()方法拦截路由
   // 例:
   import router from 'router'
   
   // 该方法接受一个回调函数作为参数
   // 回调函数可以通过三个形式参数接收到VueRouter传递过来的参数
   // 分别是 跳转后的路由、跳转前的路由、跳转路由的执行方法
   // 最后一个参数是一个回调函数 调用时可以传递一个回调函数作为参数
   // 回调函数中可以传递一个回调函数作为实参 该回调函数可以接受到VueRouter传递过来的Vue实例
   router.beforeEach((to, from, next) => {
       next(vm => {
           // ...在这里可以通过vm实例访问vue市里的方法和属性
       })
   })
   ```

2. 在组件中注册局部路由监听

   ```javascript
   // 在组件中，可以设置三个属性方法来监听路由跳转
   // 监听路由进入 beforeRouteEnter(to, from, next)
   // 监听路由离开 beforeRouteLeave(to, from, next)
   // 监听路由更新 beforeRouteUpdate(to, from, next)
   // 参数的使用与 beforeEach() 一致
   ```

   