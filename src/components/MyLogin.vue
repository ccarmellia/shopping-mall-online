<template>
  <div id="loginView" style="background: #55a532">
    <el-drawer
        title="我是标题"
        :visible.sync="isLogin"
        :direction="'ttb'"
        :with-header="false" ref="drawer"
        class="login-drawer"
        style="margin: 0 auto;width: 1225px;" size="auto">

    <!-- form表单 绑定不能用 v-model 要用 :model -->
    <el-form :rules="rules"
             ref="loginForm"

             v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"

             :model="loginForm"
             class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" prefix-icon="el-icon-user-solid" auto-complete="false" v-model="loginForm.account" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" prefix-icon="el-icon-view" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"  show-password></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input  type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码" style="width:110px;margin-right: 5px" ></el-input>
        <img style="width: 150px;margin-left: 10px" :src="captchaUrl" @click="updateCaptcha">
      </el-form-item>
<!--      <el-checkbox v-model="checked" style="margin-bottom:20px">记住我</el-checkbox>-->
      <el-button type="primary" style="width:100%" @click="Login">登录</el-button>
    </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  name: "MyLogin",
  props:['visible'],
  data(){
    return{
      isLogin:false,    //抽屉是否展现出来

      captchaUrl:'/captcha?time='+new Date(),  //获取后端url
      loginForm:{
        account:'',
        password:'',
        code:''
      },
      userToken:'',
      //点击登录的后的加载动画，设置默认关闭状态，点击之后在做处理
      loading: false,
      // checked:true,
      rules:{
        account:[{ required: true, message: '请输入用户名', trigger: 'blur'}],
        password:[{required:true,message:'请输入密码',trigger:'blur'}],
        code:[{required:true,message:'请输入验证码',trigger:'blur'}]
      }
    }
  },
  watch:{
    // 监听父组件传过来的register变量，设置this.isRegister的值
    visible: function(val) {
      if (val) {
        this.isLogin = val;
      }
    },
    // 监听this.isLogin变量的值，更新父组件register变量的值
    isLogin: function(val) {
      if (!val) {
        this.$refs["loginForm"].resetFields();
        this.$emit("fromChild", val);
      }
    }
  },
  methods: {
    updateCaptcha() {    //更换验证码操作
      this.captchaUrl = '/captcha?time=' + new Date();
    },
    ...mapMutations(['changeLogin','setUser']),
    Login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          //点击登录后开启的加载等待的css样式  this.loading = true;
          // this.loading = true;
          var loginvo = this.loginForm;
          this.postRequest('/customer/logined',loginvo).then(resp =>{
            if(resp.data.status==='success') {
              // this.userToken = 'Barer'+resp.data.token;
              this.userToken = resp.data.token;
              this.changeLogin(this.userToken);   //存储token
              localStorage.setItem('Authorization', this.userToken);
              let user = JSON.stringify(resp.data.user);
              console.log(user.cusId)
              this.setUser(resp.data.user);
              localStorage.setItem('user',user);
              this.isLogin = false;
              this.messageSuccess("登录成功");
              // this.$router.replace("/products");
            }else {
              // 清空输入框的校验状态
              this.$refs["loginForm"].resetFields();
              // 弹出通知框提示登录失败信息
              this.$message.error(resp.data.status);
            }
            console.log(resp)
          })
          //验证登录表单数据，得到该接口的返回值
          // this.postRequest('/login', this.loginForm).then(resp => {
          //   //成功了返回token，没成功返回错误信息，returnToken此时返回的是null
          //   //访问接口得到返回值后（不管返回值对象是null，还是登录成功有值），关闭加载动
          //   this.loading = false;
          //   //判断登录成功后的返回信息存不存在，不存在说明有错误响应被拦截，接口的返回值是空的
          //   if (resp) {
          //     //存储登录返回的token
          //     const tokenStr = resp.obj.tokenHead + resp.obj.token;
          //     //将登录成功，拼接后的token存入全局，
          //     window.sessionStorage.setItem('tokenStr', tokenStr);
          //     //跳转首页
          //     this.$router.replace('/home');
          //   } else {
          //     this.$message({
          //       message: '所有字段不能为空',
          //       type: 'warning'
          //     });
          //     return false;
          //   }
          // });
        }
      });
    }
  }
}
</script>

<style scoped>

.loginContainer{
  border-radius: 15px;
  background-clip: padding-box;
  margin:45px auto;
  border: 1px solid #eaeaea;
  width: 350px;
  padding:15px 35px 15px 35px;
  background: #fff;
  box-shadow:0 0 25px #cac6c6;
}
.loginTitle{
  text-align: center;
  margin-top: 3%;
}
el-form-item__content{
  /*display: flex;*/
  align-items: center;
}
.login-drawer ::-webkit-scrollbar{
    display: none;     /*消除滑条*/
}


</style>