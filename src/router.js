import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/release/release'
    },
    { // 编辑，嵌套与app
      path: '/release/release',
      component: require('./views/release/release').default
    },
    { // 预览，嵌套与app
      path: '/preview/preview',
      component: require('./views/preview/preview').default
    },
    // 外访详情页面
    {
      path: '/details/details', 
      component: require('./views/details/details').default
    }
  ],
  /*scrollBehavior (to, from, savedPosition) {
    // 从新闻详情回到新闻列表保持滚动条的位置
    if (to.path === '/news/newsList' && from.path === '/news/newsDetail' && savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }*/
})

export default router
