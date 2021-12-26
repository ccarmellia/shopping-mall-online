import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Message } from "element-ui";

Vue.use(ElementUI);

//全局组件
import MyLogin from './components/MyLogin';
Vue.component(MyLogin.name, MyLogin);
import MyRegister from "./components/MyRegister";
Vue.component(MyRegister.name,MyRegister);
import ProductList from "./components/ProductList";
Vue.component(ProductList.name,ProductList);
import Comment from "./components/Comment";
Vue.component(Comment.name,Comment);
import StoreList from "./components/StoreList";
Vue.component(StoreList.name,StoreList);

import {postRequest} from "./utils/api";
import {postForm} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";


Vue.prototype.postRequest= postRequest;
Vue.prototype.postForm = postForm;
Vue.prototype.getRequest= getRequest;
Vue.prototype.deleteRequest= deleteRequest;
// 封装提示成功的弹出框
Vue.prototype.messageSuccess = function (msg) {
    this.$message({
        message: msg,
        type: 'success'
    });
};
import axios from "axios";
//这里要导入store
import store from "./store";
import upload from "element-ui/packages/upload/src/ajax";

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
    config => {
      if (localStorage.getItem('Authorization')) {
        config.headers.Authorization = localStorage.getItem('Authorization');
      }
      config.headers["Content-type"] = "application/json;charset=UTF-8";        //设置这个,不然后端接收的数据，末尾多了一个＝
      return config;
    },
    error => {
      return Promise.reject(error);
    });

// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('Authorization');
    let user = JSON.parse(localStorage.getItem('user'));
    // 判断路由是否设置相应校验用户权限
    if (to.meta.requireAuth) {
        if (!token) {
            // 没有登录，显示登录组件
            Message.error("您没有权限,请先登录")
            if (from.name == null) {
                //此时，是在页面没有加载，直接在地址栏输入链接，进入需要登录验证的页面
                next("/");
                return;
            }
            // 终止导航
            // next(false);
            next("/")
            return;
        }
        if((to.name=='MyStore'||to.name=='AddProduct'||to.name=='DeleteProduct')&& user.cusStatus ==0){    //防止顾客进入商家页面
            Message.error("您没有权限")
            next(false);
            return;

        }

    }
    next();
});

Vue.config.productionTip = false

new Vue({
  router,store,
  render: function (h) { return h(App) }
}).$mount('#app')
