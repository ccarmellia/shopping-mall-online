<template>
    <div class="addProduct">
      <el-form
          :model="productForm"
          :rules="rules"
          status-icon
          ref="productForm"
          class="demo-ruleForm"
      >
        <el-form-item prop="storeDetail">
          <p>商品名称:</p>
          <el-input
              type="textarea"
              maxlength="30"
              show-word-limit
              placeholder="请输入商品名称"
              v-model="productForm.productName">
          </el-input>
        </el-form-item>
        <el-form-item ref="upload_attach"  label="商品图片上传：" prop="productImage"  >
          <el-upload
              ref="upload_picture"
              class="upload-picture"
              action="/store/addProduct"
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
        </el-form-item>
        <el-form-item>
          <p>商品价格</p>
          <el-input-number v-model="productForm.productPrice" :precision="2" :step="0.1" ></el-input-number>
        </el-form-item>
        <el-form-item>
          <p>商品库存</p>
          <el-input-number v-model="productForm.productExist" :step="10"></el-input-number>
        </el-form-item>
        <el-form-item>
          <p>商品类别</p>
          <el-select v-model="productForm.typeId" clearable placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" style="width: 100%" @click="addProduct">添加商品</el-button>
      </el-form>
    </div>
</template>

<script>
export default {
  name: "AddProduct",
  data(){

    let validateAttach = (rule, value, callback) => {
      if (this.fileList.length == 0) {
        callback(new Error('请上传商品图片'));
      } else {
        callback();
      }
    };

    return{
      storeId:'',//店铺id
      options:[],//类型选项
      productForm:{
        productName:'',//商品名称
        productImage:null,//商品图片
        productPrice:'',//商品价格
        productExist:'',//商品库存
        typeId:'',//类型id
      },
      fileList:[],
      rules:{
        productName:[{ required: true, message: '请输入商品名称',trigger:'blur'}],
        productImage:[{ validator: validateAttach }],
        productPrice:[{ required: true, message: '请设置商品价格', trigger: 'blur' }],
        productExist:[{required: true, message: '请设置商品库存', trigger: 'blur'}],
        typeId:[{required: true, message: '请选择商品类别', trigger: 'blur'}]
      }
    }
  },
  created() {
    this.getStoreId();//获取店铺id
    this.getTypeList();//获取类型列表
  },
  activated() {
    this.resetForm();
    this.removeFile();
  },
  methods: {
    getStoreId() {
      const cusId = this.$store.getters.getUser.cusId;
      this.postRequest('/store/getStoreId', cusId).then(resp => {
        this.storeId = resp.data.storeId;
      })
    },
    getTypeList() {
      this.postRequest('/type/getOptions', {}).then(resp => {
        this.options = resp.data.options;
        console.log(resp.data.options);
        console.log(this.options)
      })
          .catch(err => {
            return Promise.reject(err);
          });
    },
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
    resetForm(){
      this.productForm.productName = '';
      this.productForm.productPrice = '';
      this.productForm.productExist = '';
      this.productForm.typeId = '';
      this.productForm.productImage = null;
    },
    addProduct() {
      // 校验合法性
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          this.$refs.upload_picture.submit() // 触发调用uploadSectionFile，拿到param参数里面的File;
        } else {
          this.$message.error('请填写完整信息再后添加');
          return false;
        }
      });
    },
    uploadSectionPicture(param) {
      console.log(param)

      let data = new FormData();

      this.productForm.productImage = param.file // 将form中的files字段赋值File对象

      // 将form表单中的值都赋值给FormData传递给后台
      for (let key in this.productForm) {
        data.append(key, this.productForm[key])
      }
      data.append("storeId", this.storeId);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.postForm(param.action, data, config).then(resp => {
        this.fileList = [];// 提交完成清空附件列表
        if (resp.data.status == "success") {
          this.$message.success("商品添加成功")
        } else {
          this.$message.error("商品添加失败");
        }
        this.$router.replace('/myStore');//注册成功跳转我的店铺
      })
          .catch(err => {
            return Promise.reject(err);
          });
    }
  }
}
</script>

<style scoped>
.addProduct{
  width: 1225px;
}
el-form .demo-ruleForm{
  width: 1225px;
}
</style>