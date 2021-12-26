<template>
  <div id="register">
    <el-drawer
        title="我是标题"
        :visible.sync="isRegister"
        :direction="'btt'"
        :with-header="false" ref="drawer2"
        class="register-drawer"
        style="margin: 0 auto;width: 1225px" size="auto">

      <!-- form表单 绑定不能用 v-model 要用 :model -->
      <el-form :rules="rules"
               ref="registerForm"

               v-loading="loading"
               element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)"

               :model="registerForm"
               class="registerContainer">
        <h3 class="registerTitle">用户注册</h3>
        <el-form-item prop="account">
          <el-input type="text" prefix-icon="el-icon-user-solid" auto-complete="false" v-model="registerForm.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-view" auto-complete="false" v-model="registerForm.password" placeholder="请输入密码"  show-password></el-input>
        </el-form-item>
        <el-form-item prop="password2">
          <el-input type="password" prefix-icon="el-icon-view" auto-complete="false" v-model="registerForm.password2" placeholder="请确认密码"  show-password></el-input>
        </el-form-item>
        <el-button type="primary" style="width:100%" @click="Register">注册</el-button>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "MyRegister",
  props:['visible'],
  data(){
    // 用户名的校验方法
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      }
      //判断数据库中是否已经存在该用户名
      this.postRequest("/customer/findCustomer", this.registerForm.account)
      .then(res => {
        //如果存在
        if (res.data.status === "noexist") {
          this.$message("该用户名可以使用")
          this.$refs.registerForm.validateField("checkPass");
          return callback();
        } else {
          this.$message("该用户名已经存在")
          return callback(new Error('该用户名已经存在了！'));
        }
      })
      .catch(err => {
        return Promise.reject(err);
      });

    };
    // 密码的校验方法
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入密码"));
      }
      this.$refs.registerForm.validateField("checkPass");
      return callback();
    };
    // 确认密码的校验方法
    let validateConfirmPass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入确认密码"));
      }
      // 校验是否以密码一致
      if (this.registerForm.password != "" && value === this.registerForm.password) {
        this.$refs.registerForm.validateField("checkPass");
        return callback();
      } else {
        return callback(new Error("两次输入的密码不一致"));
      }
    };
    return{
      isRegister:false,    //抽屉是否展现出来
      timer:null,

      registerForm:{
        account:'',
        password:'',
        password2:''
      },
      //点击登录的后的加载动画，设置默认关闭状态，点击之后在做处理
      loading: false,
      checked:true,
      rules:{
        account:[{ validator: validateName, trigger: 'blur'}],
        password:[{validator: validatePass,trigger:'blur'}],
        password2:[{validator: validateConfirmPass,trigger:'blur'}]
      }
    }
  },
  watch:{
    // 监听父组件传过来的register变量，设置this.isRegister的值
    visible: function(val) {
      if (val) {
        this.isRegister = val;
      }
    },
    // 监听this.isLogin变量的值，更新父组件register变量的值
    isRegister: function(val) {
      if (!val) {
        this.$refs["registerForm"].resetFields();
        this.$emit("fromChild", val);
      }
    }
  },
  methods: {
    Register() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          //点击登录后开启的加载等待的css样式  this.loading = true;
          this.loading = true;
          let registervo = this.registerForm;
          this.postRequest('/customer/register',registervo).then(resp => {
            if(resp.data.status==='success') {
              this.loading = false;
              this.isRegister = false;
              this.$notify({
                title: '注册',
                message: '恭喜您成为本店普通会员',
                type: 'success'
              });
              // this.$router.replace("/");
            }else {
              this.loading = false;
              // 清空输入框的校验状态
              this.$refs["registerForm"].resetFields();
              // 弹出通知框提示登录失败信息
              this.$message.error(resp.data.status);
            }
            console.log(resp)
          })
        }
      });
    }
  }
}
</script>

<style scoped>
.registerContainer{
  border-radius: 15px;
  background-clip: padding-box;
  margin:45px auto;
  border: 1px solid #eaeaea;
  width: 350px;
  padding:15px 35px 15px 35px;
  background: #fff;
  box-shadow:0 0 25px #cac6c6;
}
.registerTitle{
  text-align: center;
  margin-top: 3%;
}
.el-form-item__content{
  display: flex;
  align-items: center;
}
.register-drawer ::-webkit-scrollbar{
  display: none;     /*消除滑条*/
}
</style>