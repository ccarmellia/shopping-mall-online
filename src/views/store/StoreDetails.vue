<template>
  <div id="storeDetails" class="storeDetails">
    店铺详情
    <!--商品信息区-->
    <div class="store">
      <!--左侧为商品图片-->
      <div class="bigPicture">
        <el-image
            style="height:300px"
            :src="storeDetails.storeImage"
            :preview-src-list="srcList">
        </el-image>
      </div>
      <!-- 右侧内容区 -->
      <div class="content">
        <p class="storeDetail">{{storeDetails.storeDetail}}</p>
        <p class="storeName">{{storeDetails.storeName}}</p>
        <p class="storeIncome">店铺收入:{{storeDetails.storeIncome}}元</p>
      </div>
    </div>
    全部商品
    <!-- 店铺内全部商品 -->
    <div class="main">
      <div class="product-lists"> <!--这个不能为list不然会有冲突，bug-->
        <ProductList :productList="productLists" v-if="productLists.length>0"></ProductList>
        <div v-else class="none-product"><span style="margin-left: 20px">抱歉没有找到相关的商品，请看看其他的商品</span></div>
      </div>
      <!-- 分页END -->
    </div>
  </div>
</template>

<script>
export default {
  name: "StoreDetails",
  data(){
    return{
      storeID:"",//店铺id
      storeDetails:"",//商品详细信息
      srcList:[],//店铺图片列表,
      productLists:"",
    }
  },
  activated() {
    if(this.$route.query.storeID!=undefined){
      this.storeID=this.$route.query.storeID;
    }
  },
  watch: {
    // 监听店铺id的变化，请求后端获取商品数据
    storeID: function(val) {
      this.getStoreDetails(val);
      this.getProductLists(val);
    }
  },
  methods:{
    getStoreDetails(val) {
      this.postRequest("/store/getStoreDetail",val).then(resp =>{
        this.storeDetails = resp.data.storeDetails;
        this.srcList = resp.data.srcList;
      }).catch(err =>{
        return Promise.reject(err);
      });
    },
    getProductLists(val){
      this.postRequest("/store/getProductLists",val).then(resp =>{
        this.productLists = resp.data.productLists;
      })
    }
  }
}
</script>

<style scoped>

#storeDetails .store {
  width: 1225px;
  height: 400px;
  padding-top: 30px;
  margin: 0 auto;
}
#storeDetails .store .bigPicture {
  float: left;
  width: 300px;
  height: 300px;
}
#storeDetails .store .content {
  float: left;
  margin-left: 25px;
  width: 640px;
}
#storeDetails .store .content .storeDetail {
  color: #b0b0b0;
  padding-top: 10px;
}
#storeDetails .store .content .storeName {
  color: #ff6700;
  padding-top: 10px;
}
#storeDetails .store .content .storeIncome {
  display: block;
  font-size: 18px;
  color: #ff6700;
  border-bottom: 1px solid #e0e0e0;
  padding: 25px 0 25px;
}
/*#storeDetails .product .content .productExist{*/
/*  margin-right: 20px;*/
/*}*/
/* 店铺全部商品 */
.storeDetails .main {
  margin: 0 auto;
  max-width: 1225px;
}
.storeDetails .main .product-lists {
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: -13.7px;
  overflow: auto;
}
</style>