<template>
    <div id="personCenter">
      <div  class="title">
        <span >个人信息</span>
      </div>
      <div style="text-align: center">
        <div class="el-upload">
          <my-upload
              v-show="showDialog"
              :headers="headers"
              url="/customer/updateAvatar"
              field="cusAvatar"
              :params="{'customerId':this.$store.getters.getUser.cusId}"
              :modelValue.sync="showDialog"
              @crop-upload-success="cropUploadSuccess"></my-upload>
          <img
              v-if="this.$store.getters.getUser.cusImage"
              :src="this.$store.getters.getUser.cusImage"
              style="width: 200px;height: 200px;border-radius: 100px"
              title="点击更换头像"
              class="avatar"
              @click="toggleShow"
          >
          <img
              v-else
              src="../assets/images/defaultAvatar.png"
              style="width: 200px;height: 200px;border-radius: 100px"
              title="点击更换头像"
              class="avatar"
              @click="toggleShow"
          >
        </div>
      </div>
      <div class="personDetails">
        <p>
          <i class="el-icon-s-custom"></i><span >个人账号</span>
          <label>{{this.$store.getters.getUser.cusName}}</label>
        </p>
        <p>
          <i class="iconfont icon-mima"></i><span >个人密码</span>
          <label>{{this.$store.getters.getUser.cusPwd}}</label>
        </p>
        <p>
          <i class="iconfont icon-shenfen"></i><span >个人身份</span>
          <label v-if="this.$store.getters.getUser.cusStatus=='0'">普通会员</label>
          <label v-else>高级会员</label>
        </p>
        <p>
          <i class="iconfont icon-yue"></i><span >个人余额</span>
          <label>{{this.$store.getters.getUser.cusProperty}}</label>
        </p>
        <p>
          <i class="iconfont icon-shouye"></i><span >个人地址</span>
          <label>{{this.$store.getters.getUser.cusAddress}}</label>
        </p>
      </div>
    </div>
</template>
<script>
import 'babel-polyfill'; // es6 shim
import myUpload from 'vue-image-crop-upload';
import {mapActions} from "vuex";

export default {
  name: "PersonCenter",
  data(){
    return{
      showDialog:false,
      headers: {
        'Authorization': this.$store.getters.getToken
      },
    }
  },
  components: {
    "my-upload": myUpload
  },
  methods:{
    ...mapActions(['updateAvatar']),
     // 点击头像打开上传窗口
    toggleShow() {
      this.showDialog = !this.showDialog;
    },
    //修改头像
    cropUploadSuccess(jsonData, field) {
      //field为传给后端的文件变量名
      if(jsonData.status==='success') {
        this.updateAvatar(jsonData.newImage);
        this.messageSuccess("头像修改成功")
      }else {
        this.$message.error("头像修改失败")
      }
    },
  }
}
</script>

<style scoped>
#personCenter{
  width: 1225px;
  height: 600px;
  margin: 0 auto;
  background-color: #8EC5FC;
  background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);

}
#personCenter .title{
  margin: 0 auto;
}
.personDetails p{
  margin: 45px 30%;
}
.personDetails p i{
  margin-right: 5px;
}
.personDetails p label{
  margin-left: 300px;
}
</style>