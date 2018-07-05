import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)


/* Layout */
import Layout from '../views/layout/index'

export const constantRouterMap = [
  {
    path: '/login',
    name:'login',
    component: _import('login/index'),
    hidden: true
  },
  {
    path:'/hello',
    name:'HelloWorld',
    component: HelloWorld,
    hidden:true
  },
  {
    path:'/show',
    name:'show',
    component: _import('show/index'),
    hidden:true
  },
  {
    path:'',
    component: Layout,
    redirect: 'statistic',
    children: [{
      path: 'statistic',
      component: _import('statistic/index'),
      name: 'statistic',
      meta: { title: 'statistic', icon: 'statistics', noCache: true}
    }]

  }

]

export default new Router({
  hashbang: false,
  transitionOnload: false,
  history: true,
  mode:'history',
  scrollBehavior: () => ({ y: 0 }),
  // routes: [
  //   {
  //     path: '/hello',
  //     name: 'HelloWorld',
  //     component: HelloWorld
  //   }
  // ]
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path:'/college',
    component: Layout,
    redirect: '/college/index',
    children: [{
      path: 'index',
      component: _import('college/index'),
      name: 'college',
      meta: { title: 'college', icon: 'college', noCache: true}
    }]

  },
  {
    path:'/student',
    component: Layout,
    redirect: '/student/index',
    meta: {
      title: 'student',
      icon: 'student'
    },
    children: [{
      path: 'index',
      component: _import('student/index'),
      name: 'student_index',
      meta: { title: 'studentCreate', icon: 'studentCreate', noCache: true}
    },
    {
      path: 'info',
      component: _import('student/info'),
      name: 'student_info',
      meta: { title: 'studentInfo', icon: 'studentInfo', noCache: true}
    }]

  },
  {
    path:'/run',
    component: Layout,
    redirect: '/run/index',
    meta: {
      title: 'run',
      icon: 'run'
    },
    children: [{
      path: 'index',
      component: _import('run/index'),
      name: 'run_index',
      meta: { title: 'runIndex', icon: 'runIndex', noCache: true}
    }]

  },
  {
    path:'/device',
    component: Layout,
    redirect: '/device/index',
    meta: {
      title: 'device',
      icon: 'device'
    },
    children: [{
      path: 'index',
      component: _import('device/index'),
      name: 'deviceList',
      meta: { title: 'deviceList', icon: 'deviceList', noCache: true}
    },
    {
      path: 'info',
      component: _import('device/info'),
      name: 'devicesInfo',
      meta: { title: 'devicesInfo', icon: 'video', noCache: true}
    }
  
  ]

  },
  {
    path:'/result',
    component: Layout,
    redirect: '/result/index',
    meta: {
      title: 'result',
      icon: 'result'
    },
    children: [
      {
      path: 'index',
      component: _import('result/index'),
      name: 'result',
      meta: { title: 'result', icon: 'result', noCache: true}
    },
    {
      path: 'list',
      component: _import('result/list'),
      name: 'resultList',
      meta: { title: 'resultList', icon: 'resultList', noCache: true}
    }
  
  ]
  }

  
]
