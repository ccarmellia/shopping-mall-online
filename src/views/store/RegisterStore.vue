<template>
    <div class="registerStore" id="registerStore">
      店铺注册
      <el-form
          :model="registerStore"
          :rules="rules"
          status-icon
          ref="ruleForm"
          class="demo-ruleForm"
      >
        <el-form-item prop="storeName">
          <el-input
              prefix-icon="el-icon-user-solid"
              placeholder="请输入店铺名称"
              v-model="registerStore.storeName"
          ></el-input>
        </el-form-item>
        <el-form-item ref="upload_attach"  label="店铺图片上传：" prop="storeImage"  >
          <el-upload
              ref="upload_picture"
              class="upload-picture"
              action="/store/register"
              multiple
              accept=".jpg,.png,.jpeg"
              :limit="1"
              :on-change="changFile"
              :on-exceed="handleExceed"
              :on-remove="removeFile"
              :file-list="fileList"
              :auto-upload="false"
              :http-request="uploadSectionPicture">
<!--            <img v-if="imageUrl" :src="imageUrl" class="avatar">-->
<!--            <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
            <div slot="tip" class="el-upload__tip">注:上传的文件须是jpg,png或jpeg格式</div>
          </el-upload>
          <el-progress :percentage="progressPercent" v-show="show_progress"></el-progress>
          <el-form-item prop="storeDetail">
            <el-input
                type="textarea"
                maxlength="30"
                show-word-limit
                placeholder="请输入店铺描述"
                v-model="registerStore.storeDetail">
            </el-input>
          </el-form-item>
        </el-form-item>
        <el-button type="primary" style="width: 100%" @click="register">注册店铺</el-button>
      </el-form>
    </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "RegisterStore",
  data() {
    //店铺名称
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入店铺名称"));
      }
      //判断数据库中是否已经存在该用户名
      this.postRequest("/store/findStore", this.registerStore.storeName)
          .then(res => {
            //如果存在
            if (res.data.status === "noexist") {
              this.$message("该店铺名可以使用")
              this.$refs.ruleForm.validateField("checkPass");
              return callback();
            } else {
              this.$message("该店铺名已经存在")
              return callback(new Error('该店铺名已经存在了！'));
            }
          })
          .catch(err => {
            return Promise.reject(err);
          });
    };
    let validateAttach = (rule, value, callback) => {
      if (this.fileList.length == 0) {
        callback(new Error('请上传店铺图片'));
      } else {
        callback();
      }
    };

    return{
        registerStore:{
          storeName:'',
          storeImage:null,
          storeDetail:'',
        },
        imageUrl: '',
        fileList:[],
        progressPercent:0,
        show_progress:false,
        rules:{
          storeName:[{ validator: validateName, trigger:'blur'}],
          storeImage:[{ validator: validateAttach }],
          storeDetail:[{ required: true, message: '请输入店铺描述', trigger: 'blur' }]
        }
    }
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    this.removeFile();
  },
  methods: {
    ...mapActions(['updateStatus']),
    changFile(file, fileList) {
      //选择文件后，给fileList对象赋值
      this.fileList = fileList
      this.$refs.upload_attach.validate();

    },
    removeFile(file, fileList) {
      this.fileList = fileList
      this.$refs.upload_attach.validate();
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能选择一张图片`);
    },
    register(){
      // 校验合法性
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$refs.upload_picture.submit() // 触发调用uploadSectionFile，拿到param参数里面的File;
        } else {
          this.$message.error('请填写完整信息再后注册');
          return false;
        }
      });
    },
    uploadSectionPicture(param) {
      console.log(param)

      let data = new FormData();

      this.registerStore.storeImage = param.file // 将form中的files字段赋值File对象

      // 将form表单中的值都赋值给FormData传递给后台
      for (let key in this.registerStore) {
        data.append(key, this.registerStore[key])
      }
      data.append("cusId",this.$store.getters.getUser.cusId);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.postForm(param.action,data,config).then(resp =>{
        this.fileList = [];// 提交完成清空附件列表
        // this.show_progress = false
        this.progressPercent = 0
        if(resp.data.status == "success"){
          this.updateStatus(1);
          this.$notify.success("店铺注册成功");
        }else {
          this.$notify.error("店铺注册失败");
        }
        this.$router.replace('/');//注册成功跳转首页
      })
      .catch(err => {
        return Promise.reject(err);
      });

    }
  }
}
</script>

<style scoped>
.upload-picture .avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>