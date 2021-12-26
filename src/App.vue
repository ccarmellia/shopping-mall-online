<template>
  <div id="app">
    <el-container>
      <!-- 顶部导航栏 -->
      <div class="topbar" v-show="!(path === '/adminLogin')">
        <div class="nav">
          <ul>
            <li v-if="!this.$store.getters.getUser">
              <el-button type="text" @click="loginView = true">登录</el-button>
              <span class="sep">|</span>
              <el-button type="text" @click="registerView = true">注册</el-button>
            </li>
            <li v-else>
              <el-popover placement="top" width="250" v-model="visible">
                <div id="personal">
                  <i><img :src="this.$store.getters.getUser.cusImage" style="width: 80px;height: 80px;border-radius: 40px"></i>
                  <span v-if="this.$store.getters.getUser.cusStatus=='1'">高级会员</span>
                  <span v-else>普通会员</span>
                  <router-link to="/personCenter"><span style="color: #409EFF">个人中心</span></router-link>
                  <el-button type="text" @click="logout" >退出登录</el-button>
                </div>
<!--                <p>确定退出登录吗？</p>-->
<!--                <div style="text-align: right; margin: 10px 0 0">-->
<!--                  <el-button size="mini" type="text" @click="visible = false">取消</el-button>-->
<!--                  <el-button type="primary" size="mini" @click="logout">确定</el-button>-->
<!--                </div>-->
                <el-button type="text" slot="reference">{{this.$store.getters.getUser.cusName}}</el-button>
              </el-popover>
            </li>
            <li>
              <router-link to="/myOrder">我的订单</router-link>
            </li>
            <li>
              <router-link to="/adminLogin">后台</router-link>
            </li>
            <li :class="getCount > 0 ? 'shopCart-full' : 'shopCart'">
              <router-link to="/shoppingCart">
                <i class="iconfont icon-shouye1"></i> 购物车
                <span class="num">({{getCount}})</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    <!-- 主要区域容器 -->
      <el-header style="margin: 0px;padding: 0px" v-show="!(path === '/adminLogin')">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#1aeaea"
            text-color="#fff"
            active-text-color="#ffd04b"
          router>
          <div class="logo">
            <router-link to="/">
              <img src="./assets/img.png" style=" height: 60px;width: 60px;float: left;margin-right: 150px;"/>
            </router-link>
          </div>
          <el-menu-item index="/" >首页</el-menu-item>
          <el-menu-item index="/products">全部商品</el-menu-item>
          <el-menu-item index="/stores" >全部店铺</el-menu-item>
          <el-menu-item index="/registerStore" v-if="this.getUser.cusStatus=='0'">我要开店</el-menu-item>
          <el-menu-item index="/myStore" v-if="this.getUser.cusStatus=='1'">我的店铺</el-menu-item>

          <div class="so">
            <el-input placeholder="请输入搜索内容" v-model="search">
              <el-select v-model="searchType" placeholder="请选择" slot="prepend" style="width: 90px" >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" >
                </el-option>
              </el-select>
              <el-button type="primary"  slot="append" @click="searchClick" icon="el-icon-search">搜索</el-button>
            </el-input>
          </div>
        </el-menu>
      </el-header>

      <MyLogin :visible="loginView" @fromChild="isLogin"></MyLogin>
      <MyRegister :visible="registerView" @fromChild="isRegister"></MyRegister>

    <el-main style="min-height: 600px;margin: 0 auto">
      <keep-alive >
        <router-view></router-view>
      </keep-alive>
    </el-main>
      <!-- 底栏容器 -->
      <el-footer style="padding: 0;margin-top: 0px" v-show="!(path === '/adminLogin')">
        <div class="footer">
          <div class="mod_help">
            <p>
              <router-link to="/">回到首页</router-link>
            </p>
<!--            <p class="coty">顾客就是上帝</p>-->
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
  beforeUpdate() {
    this.activeIndex = this.$route.path;
  },
  data() {
    return {
      path:'',//当前路径
      loginView:false,  // 是否显示登录组件
      activeIndex: "", // 头部导航栏选中的标签
      search: "", // 搜索条件
      registerView: false, // 是否显示注册组件
      visible: false,// 是否退出登录
      searchType:"",
      options:[{
        value:'product',
        label:'商品'
      },{
        value:'store',
        label:'店铺'
      }]
    };
  },
  mounted() {
    this.path = this.$route.path;
  },
  created: function (){
    // // 获取浏览器localStorage，判断用户是否已经登录
    if (localStorage.getItem("user")) {
      // 如果已经登录，设置vuex登录状态
      this.setUser(JSON.parse(localStorage.getItem("user")));
    }
  },
  computed: {
    ...mapGetters(["getUser","getCount"]),
  },
  watch:{
    //监听路由变化,
    $route(to){
      this.path = to.path
    },
    //获取登录状态
    getUser:function (val){
      if(val === ""){
        //如果未登录,购物车设置为空
        this.setShoppingCart([]);
      }else {
        //已经登录,获取并设置购物车信息
        this.postRequest("/order/getShoppingCarts",val.cusId).then(resp =>{
          if(resp.data.status == "success"){
            this.setShoppingCart(resp.data.shoppingCarts);
          }else {
            this.$notify.error("获取购物车信息失败");
          }
        })
        .catch(err => {
          return Promise.reject(err);
        })
      }
    }
  },
  methods:{
    ...mapActions(['setUser','changeLogin','setShoppingCart']),
    isLogin(val){
      this.loginView = val;
    },
    isRegister(val){
      this.registerView = val;
    },
    logout(){
      this.visible = false;
      // 清空本地登录信息
      localStorage.removeItem("user");
      localStorage.removeItem("Authorization")
      // 清空vuex登录信息
      this.setUser("");
      this.changeLogin("");
      this.$router.push("/");
      this.$message("成功退出登录");
    },
    // 点击搜索按钮
    searchClick() {
      if (this.search != "") {
          if(this.searchType=="product") {
          // 跳转到全部商品页面,并传递搜索条件
          this.$router.push({path: "/products", query: {search: this.search}});
          this.search = "";
        }else if(this.searchType=="store"){
            console.log(this.searchType)
            console.log(this.search)
            this.$router.push({path:"/stores",query:{search:this.search}});
            this.search = "";
          }else {
            console.log(this.searchType)
            console.log(this.search)
            this.$message.error("请选择搜索类型");
            return ;
          }
      }
      else {
        return;
      }
    }
  }
}
</script>
<style >
/* 全局CSS */
*{
  padding: 0;
  margin: 0;
  border: 0;
  list-style: none;
}
.el-menu-demo el-menu-item{
  padding:50px;
  display: flex;
}
#app .el-header {
  padding: 0;
}
#app .el-main {
  min-height: 300px;
  padding: 20px 0;
}
#app .el-footer {
  padding: 0;
}
a,
a:hover {
  text-decoration: none;
}
/* 全局CSS END */

/* 顶部导航栏CSS */
.topbar {
  height: 40px;
  background-color: #3d3d3d;
  /*margin-bottom: 20px;*/
}
.topbar .nav {
  width: 1225px;
  margin: 0 auto;
}
.topbar .nav ul {
  float: right;
}
.topbar .nav li {
  float: left;
  height: 40px;
  color: #b0b0b0;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  margin-left: 20px;
}
.topbar .nav .sep {
  color: #b0b0b0;
  font-size: 12px;
  margin: 0 5px;
}
.topbar .nav li .el-button {
  color: #b0b0b0;
}
.topbar .nav .el-button:hover {
  color: #fff;
}
.topbar .nav li a {
  color: #b0b0b0;
}
.topbar .nav a:hover {
  color: #fff;
}
.topbar .nav .shopCart {
  width: 120px;
  background: #424242;
}
.topbar .nav .shopCart:hover {
  background: #fff;
}
.topbar .nav .shopCart:hover a {
  color: #ff6700;
}
.topbar .nav .shopCart-full {
  width: 120px;
  background: #ff6700;
}
.topbar .nav .shopCart-full a {
  color: white;
}
/* 顶部导航栏CSS END */

/* 顶栏容器CSS */
.el-header .el-menu {
  max-width: 1225px;
  margin: 0 auto;
}
.el-header .so {
  margin-top: 10px;
  width: 400px;
  float: right;
}

/* 顶栏容器CSS END */

/* 底栏容器CSS */
.footer {
  width: 100%;
  text-align: center;
  background: #2f2f2f;
  padding-bottom: 20px;
}
.footer .ng-promise-box .ng-promise p a {
  color: #fff;
  font-size: 20px;
  margin-right: 210px;
  padding-left: 44px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-decoration: none;
}
.footer .mod_help {
  text-align: center;
  color: #888888;
}
.footer .mod_help p {
  margin: 20px 0 16px 0;
}

.footer .mod_help p a {
  color: #888888;
  text-decoration: none;
}
.footer .mod_help p a:hover {
  color: #fff;
}
/*.footer .mod_help p span {*/
/*  padding: 0 22px;*/
/*}*/
#loginView .el-drawer__body{
  background-color: #4158D0;
  background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
}
#register .el-drawer__body{
  background-color: #0093E9;
  background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);

}
#personal>span{
  float: right;
}
/* 底栏容器CSS END */
</style>
