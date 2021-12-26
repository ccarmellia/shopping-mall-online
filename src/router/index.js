import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/shoppingCart',
    name: 'ShoppingCart',
    component: () => import('../views/order/ShoppingCart.vue'),
    meta: {
      requireAuth: true // 需要验证登录状态
    }
  },
  {
    path: '/confirmOrder',
    name: 'ConfirmOrder',
    component: () => import('../views/order/ConfirmOrder'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/myOrder',
    name: 'MyOrder',
    component: () => import('../views/order/MyOrder'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/product/Products')
  },
  {
    path: '/products/details',
    name: 'ProductDetails',
    component: () => import('../views/product/ProductDetails')
  },
  {
    path: '/stores',
    name: 'Stores',
    component: () => import('../views/store/Stores')
  },
  {
    path: '/myStore',
    name: 'MyStore',
    component: () => import('../views/store/MyStore'),
    meta: {
      requireAuth: true
    },
    children:[
      {
        path:'/addProduct',
        name:'AddProduct',
        component: () => import('../views/store/storeControl/AddProduct'),
        meta: {
          requireAuth: true
        },
      },
      {
        path:'/deleteProduct',
        name:'DeleteProduct',
        component: () => import('../views/store/storeControl/DeleteProduct'),
        meta: {
          requireAuth: true
        },
      },
    ]
  },
  {
    path: '/registerStore',
    name: 'RegisterStore',
    component: () => import('../views/store/RegisterStore'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/stores/details',
    name: 'StoreDetails',
    component: () => import('../views/store/StoreDetails')
  },
  {
    path: '/personCenter',
    name: 'PersonCenter',
    component: () => import('../views/PersonCenter'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/adminLogin',
    name: 'AdminLogin',
    component: () => import('../views/admin/AdminLogin')
  },
  {
    path: '/*',
    name: 'Error',
    component: () => import('../components/MyError')
  }
]

const router = new VueRouter({
  routes
})

/* 由于Vue-router在3.1之后把$router.push()方法改为了Promise。所以假如没有回调函数，错误信息就会交给全局的路由错误处理。
vue-router先报了一个Uncaught(in promise)的错误(因为push没加回调) ，然后再点击路由的时候才会触发NavigationDuplicated的错误(路由出现的错误，全局错误处理打印了出来)。*/
// 禁止全局路由错误处理打印
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}


export default router
