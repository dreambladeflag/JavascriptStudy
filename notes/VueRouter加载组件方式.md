##### VueRouter加载组件方式

1. import方式加载

   ```javascript
   import xxxComponent from 'xxx'
   
   new Router({
      routers: [
          {
              path: '/path',
              name: 'name',
              meta: {}, // 组件内可以通过this.$route.meta的形式获取
              component: xxxComponent
          }
      ] 
   })
   ```

2. 使用import()函数自动加载

   ```javascript
   new Router({
       routers: [
           {
               path: '/path',
               name: 'name',
               meta: {}, // 组件内可以通过this.$route.meta的形式获取
               component: () => import('xxx')
           }
       ]
   })
   ```

3. 使用require()函数懒加载（按需加载）

   ```javascript
   new Router({
       routers: [
           {
               path: '/path',
               name: 'name',
               meta: {}, // 组件内可以通过this.$route.meta的形式获取
               component: resolve => reuqire(['xxx'], resolve)
           }
       ]
   })
```
   
   