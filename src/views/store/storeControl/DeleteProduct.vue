<template>
    <div class="deleteProduct">
      <div class="product-lists"> <!--这个不能为list不然会有冲突，bug-->
        <ProductList :productList="productLists" :isDelete="true" v-if="productLists.length>0"></ProductList>
        <div v-else class="none-product"><span style="margin-left: 20px">您店内没有商品,赶快去添加吧！</span></div>
      </div>
    </div>
</template>

<script>
export default {
  name: "DeleteProduct",
  data(){
    return{
      storeId:'',//店铺id
      productLists:'',//店铺内商品
    }
  },
  created() {
    this.getStoreId();//获取店铺id
  },
  activated() {
    this.getStoreId();//获取店铺id
    this.getProductLists();//获取商品列表
  },
  methods: {
    getStoreId() {
      const cusId = this.$store.getters.getUser.cusId;
      this.postRequest('/store/getStoreId', cusId).then(resp => {
        this.storeId = resp.data.storeId;
      })
    },
    getProductLists(){
      this.postRequest("/store/getProductLists",this.storeId).then(resp =>{
        this.productLists = resp.data.productLists;
      })
    }
  }
}
</script>

<style scoped>
.deleteProduct{
  width: 1225px;
}
.deleteProduct  .product-lists {
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: -13.7px;
  overflow: auto;
}
</style>