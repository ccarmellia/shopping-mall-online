<template>
    <div class="myOrder">
      <!--我的订单头部-->
      <div class="order-header">
        <div class="order-header-content">
          <p>
            <i class="iconfont icon-wodedingdan" style="font-size:30px;color: #ff6700;"></i>
            我的订单
          </p>
        </div>
      </div>

      <!--我的订单内容-->
      <div class="order-content" v-if="myOrder.length>0">
        <div class="content" v-for="(item,index) in myOrder" :key="index">
          <ul>
            <li class="order-info">
              <div class="order-number">订单编号: {{item[0].orderNumber}}</div>
              <div class="order-time">订单时间: {{item[0].orderTime}}</div>
            </li>
            <li class="header">
              <div class="pro-img"></div>
                <div class="pro-name">商品名称</div>
                <div class="pro-price">价格</div>
                <div class="pro-count">数量</div>
                <div class="pro-total">小计</div>

            </li>

            <li class="product-list" v-for="(product,i) in item" :key="i">
              <div class="pro-img">
                <router-link :to="{ path: '/products/details', query: {productID:product.productId} }">
                  <img :src="product.productImage" />
                </router-link>
              </div>
              <div class="pro-name">
                <router-link :to="{path:'/products/details',query:{productID:product.productId}}">
                  {{product.productName}}
                </router-link>
              </div>
              <div class="pro-price">{{product.productPrice}}</div>
              <div class="pro-count">{{product.productCount}}</div>
              <div class="pro-total pro-total-in">{{parseFloat((product.productPrice*product.productCount).toFixed(2))}}</div>
            </li>
          </ul>
          <div class="order-bar">
            <div class="order-bar-left">
              <span class="order-total">
                共
                <span class="order-total-count">{{total[index].totalCount}}件商品</span>
              </span>
            </div>
            <div class="order-bar-right">
              <span>
                <span class="total-price-title">合计:</span>
                <span class="total-price">{{total[index].totalPrice}}元</span>
              </span>
            </div>
          </div>
          <div style="margin-top:-40px;"></div>
        </div>
      </div>
      <!-- 订单为空 -->
      <div v-else class="order-empty">
        <div class="empty">
          <h2>你还没有过任何订单！</h2>
          <p>快去购物吧！</p>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "MyOrder",
  data(){
    return{
      myOrder:[],//我的订单列表
      total:[] //每个订单的商品数量及总价列表
    }
  },
  activated() {
    //获取我的订单
    this.postRequest("/order/getOrder",this.$store.getters.getUser.cusId).then(resp =>{
      if(resp.data.status == 'success'){
        this.myOrder = resp.data.myOrder;
        console.log(resp.data.myOrder);
      }else {
        this.$notify.error("获取订单失败");
      }
    })
    .catch(err =>{
      return Promise.reject(err);
    })
  },
  watch:{
    //计算每个订单的商品总数量和总价钱
    myOrder:function (val){
      let total = [];
      for(let i = 0;i < val.length;i++){
        const temp = val[i];
        let totalCount = 0;
        let totalPrice = 0;
        for(let j = 0;j < temp.length;j++){
          const count = temp[j];
          totalCount += count.productCount;
          totalPrice += Number(parseFloat((count.productCount * count.productPrice).toFixed(2)));
        }
        total.push({totalCount,totalPrice});
      }
      this.total = total;
    }
  }
}
</script>

<style scoped>
.myOrder {
  background-color: #f5f5f5;
  padding-bottom: 20px;
}
/* 我的订单头部CSS */
.myOrder .order-header {
  height: 64px;
  border-bottom: 2px solid #ff6700;
  background-color: #fff;
  margin-bottom: 20px;
}
.myOrder .order-header .order-header-content {
  width: 1225px;
  margin: 0 auto;
}
.myOrder .order-header p {
  font-size: 28px;
  line-height: 58px;
  float: left;
  font-weight: normal;
  color: #424242;
}
/* 我的订单头部CSS END */
.myOrder .content {
  width: 1225px;
  margin: 0 auto;
  background-color: #fff;
  margin-bottom: 50px;
}

.myOrder .content ul {
  background-color: #fff;
  color: #424242;
  line-height: 85px;
}
/* 我的订单表头CSS */
.myOrder .content ul .order-info {
  height: 60px;
  line-height: 60px;
  padding: 0 26px;
  color: #424242;
  border-bottom: 1px solid #ff6700;
}
.myOrder .content ul .order-info .order-number {
  float: left;
  color: #ff6700;
}
.myOrder .content ul .order-info .order-time {
  float: right;
}

.myOrder .content ul .header {
  height: 85px;
  padding-right: 26px;
  color: #424242;
}
/* 我的订单表头CSS END */

/* 订单列表CSS */
.myOrder .content ul .product-list {
  height: 85px;
  padding: 15px 26px 15px 0;
  border-top: 1px solid #e0e0e0;
}
.myOrder .content ul .pro-img {
  float: left;
  height: 85px;
  width: 120px;
  padding-left: 80px;
}
.myOrder .content ul .pro-img img {
  height: 80px;
  width: 80px;
}
.myOrder .content ul .pro-name {
  /*font-size: 14px;*/
  /*font-weight: 400;*/
  /*color: #333;*/
  text-overflow: ellipsis;
  white-space: nowrap;/*文本不换行*/
  overflow: hidden;
  float: left;
  width: 380px;
}
.myOrder .content ul .pro-name a {
  color: #424242;
}
.myOrder .content ul .pro-name a:hover {
  color: #ff6700;
}
.myOrder .content ul .pro-price {
  float: left;
  width: 160px;
  padding-right: 18px;
  text-align: center;
}
.myOrder .content ul .pro-count {
  float: left;
  width: 190px;
  text-align: center;
}
.myOrder .content ul .pro-total {
  float: left;
  width: 160px;
  padding-right: 81px;
  text-align: right;
}
.myOrder .content ul .pro-total-in {
  color: #ff6700;
}

.myOrder .order-bar {
  width: 1185px;
  padding: 0 20px;
  border-top: 1px solid #ff6700;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
}
.myOrder .order-bar .order-bar-left {
  float: left;
}
.myOrder .order-bar .order-bar-left .order-total {
  color: #757575;
}
.myOrder .order-bar .order-bar-left .order-total-count {
  color: #ff6700;
}
.myOrder .order-bar .order-bar-right {
  float: right;
}
.myOrder .order-bar .order-bar-right .total-price-title {
  color: #ff6700;
  font-size: 14px;
}
.myOrder .order-bar .order-bar-right .total-price {
  color: #ff6700;
  font-size: 30px;
}
/* 订单列表CSS END */

/* 订单为空的时候显示的内容CSS */
.myOrder .order-empty {
  width: 1225px;
  margin: 0 auto;
}
.myOrder .order-empty .empty {
  height: 300px;
  padding: 0 0 130px 558px;
  margin: 65px 0 0;
  background: url(../../assets/images/no-shoppingCart.gif) no-repeat 124px 0;
  color: #b0b0b0;
  overflow: hidden;
}
.myOrder .order-empty .empty h2 {
  margin-top: 70px;
  margin-bottom: 35px;
  margin-left: 270px;
  font-size: 36px;
}
.myOrder .order-empty .empty p {
  margin: 0 270px 20px;
  font-size: 20px;
}
</style>