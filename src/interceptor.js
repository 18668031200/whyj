import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

import cookie from '@/utils/cookie'


NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

var default_roles = {}

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  store.dispatch('GenerateRoutes', default_roles).then(() => { // 根据roles权限生成可访问的路由表
              console.log(store.getters.addRouters)
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              console.log(router)
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
  next()
  NProgress.done()


})



router.afterEach(() => {
  NProgress.done() // finish progress bar
})