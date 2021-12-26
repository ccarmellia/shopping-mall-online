<template>
    <div class="confirmOrder">
      <!-- 头部 -->
      <div class="confirmOrder-header">
        <div class="header-content">
          <p>
            <i class="iconfont icon-querendingdan"></i>
          </p>
          <p>确认订单</p>
        </div>
      </div>

      <!-- 主要内容 -->
      <div class="content">
        <!--收获地址-->
        <div class="section-address">
<!--          <el-descriptions title="用户信息">-->
<!--            <el-descriptions-item label="收件人"><i class="el-icon-user"></i>{{this.$store.getters.getUser.cusName}}</el-descriptions-item>-->
<!--            <el-descriptions-item label="收货地址"><i class="iconfont icon-shouhuodizhi"></i>{{this.$store.getters.getUser.cusAddress}}</el-descriptions-item>-->
<!--          </el-descriptions>-->
          <el-descriptions class="margin-top" title="收货信息" :column="2" :size="size" style="margin-bottom: 20px" border>
            <template slot="extra">
              <el-button type="primary" size="small">修改</el-button>
            </template>
            <el-descriptions-item>
              <template slot="label" >
                <i class="el-icon-user"></i>
                收件人
              </template>
              {{this.$store.getters.getUser.cusName}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-location-outline"></i>
                收货地址
              </template>
              {{this.$store.getters.getUser.cusAddress}}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!--购买的商品-->
        <div class="section-products">
          <p class="title">商品</p>
          <div class="products-list">
            <ul>
              <li v-for="item in getProductsChecked" :key="item.orderId">
                <img :src="item.productImage" />
                <span class="pro-name">{{item.productName}}</span>
                <span class="pro-price">￥{{item.productPrice}} x {{item.productCount}}</span>
                <span class="pro-total">{{parseFloat((item.productPrice*item.productCount).toFixed(2))}}</span>
              </li>
            </ul>
          </div>
        </div>

        <!--结算-->
        <div class="section-count">
          <div class="money-box">
            <ul>
              <li>
                <span class="title">商品件数：</span>
                <span class="value">{{getCheckCount}}件</span>
              </li>
              <li>
                <span class="title">商品总价：</span>
                <span class="value">{{getTotalPrice}}元</span>
              </li>
              <li class="total">
                <span class="title">应付总额：</span>
                <span class="value">
                <span class="total-price">{{getTotalPrice}}</span>元
              </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 付款-->
        <div class="section-bar">
          <div class="btn">
            <router-link to="/shoppingCart" class="btn-base btn-return">返回购物车</router-link>
            <a href="javascript:void(0);" @click="confirmOrder" class="btn-base btn-primary">付款</a>
          </div>
        </div>

      </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "ConfirmOrder",
  created() {
    // 如果没有勾选购物车商品直接输入地址确认订单页面,提示信息并返回购物车
    if (this.getCheckCount < 1) {
      this.$notify.error("请勾选商品后再结算");
      this.$router.push({ path: "/shoppingCart" });
    }
  },
  computed:{
    ...mapGetters(['getCheckCount','getTotalPrice','getProductsChecked'])
  },
  methods:{
    ...mapActions(['deleteShoppingCart','updateProperty']),
    confirmOrder(){
      const property = this.$store.getters.getUser.cusProperty;
      const price = this.getTotalPrice;
      //如果顾客当前总资产大于或等于才能购买
      if(Math.abs(property - price) < Number.EPSILON * Math.pow(2, 2) ||property>price){
        this.postRequest("/order/confirmOrder",{
          cusId:this.$store.getters.getUser.cusId,
          products:this.getProductsChecked,
          orderAddress:this.$store.getters.getUser.cusAddress,
          totalPrice: this.getTotalPrice
        }).then(resp =>{
          let products = this.getProductsChecked;
          if(resp.data.status == "success"){
            for(let i = 0;i<products.length;i++){
              const temp = products[i];
              //删除已经购物车付款的商品
              this.deleteShoppingCart(temp.orderId);
            }
            //当前登录的顾客资产减
            this.updateProperty(property - price);
            this.$notify.success("付款成功");
            this.$router.push("/myOrder");
          }else {
            this.$notify.error("付款失败");
          }
        })
            .catch(err =>{
              return Promise.reject(err);
            })
      }else {
        this.$notify.error("你当前余额不足");
        return;
      }

    }
  }
}
</script>

<style scoped>
.confirmOrder {
  background-color: #f5f5f5;
  padding-bottom: 20px;
}
/* 头部CSS */
.confirmOrder .confirmOrder-header {
  background-color: #fff;
  border-bottom: 2px solid #ff6700;
  margin-bottom: 20px;
}
.confirmOrder .confirmOrder-header .header-content {
  width: 1225px;
  margin: 0 auto;
  height: 80px;
}
.confirmOrder .confirmOrder-header .header-content p {
  float: left;
  font-size: 28px;
  line-height: 80px;
  color: #424242;
  margin-right: 20px;
}
.confirmOrder .confirmOrder-header .header-content p i {
  font-size: 45px;
  color: #ff6700;
  line-height: 80px;
}
/* 头部CSS END */

/* 主要内容容器CSS */
.confirmOrder .content {
  width: 1225px;
  margin: 0 auto;
  padding: 48px 0 0;
  background-color: #fff;
}

/* 地址CSS */
.confirmOrder .content .section-address {
  margin: 0 48px;
  overflow: hidden;
}
.confirmOrder .content .section-address .title {
  color: #333;
  font-size: 18px;
  line-height: 20px;
  margin-bottom: 20px;
}
.confirmOrder .content .address-body li {
  float: left;
  color: #333;
  width: 220px;
  height: 178px;
  border: 1px solid #e0e0e0;
  padding: 15px 24px 0;
  margin-right: 17px;
  margin-bottom: 24px;
}
.confirmOrder .content .address-body li h2 {
  font-size: 18px;
  font-weight: normal;
  line-height: 30px;
  margin-bottom: 10px;
}
.confirmOrder .content .address-body li p {
  font-size: 14px;
  color: #757575;
}
.confirmOrder .content .address-body .add-address i {
  font-size: 30px;
  padding-top: 50px;
  text-align: center;
}
/* 地址CSS END */

/* 商品CSS */
.confirmOrder .content .section-products {
  margin: 0 48px;
}
.confirmOrder .content .section-products p.title {
  color: #333;
  font-size: 18px;
  line-height: 40px;
}
.confirmOrder .content .section-products .products-list {
  padding: 5px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}
.confirmOrder .content .section-products .products-list li {
  padding: 10px 0;
  color: #424242;
  overflow: hidden;
}
.confirmOrder .content .section-products .products-list li img {
  float: left;
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.confirmOrder .content .section-products .products-list li .pro-name {
  text-overflow: ellipsis;
  white-space: nowrap;/*文本不换行*/
  overflow: hidden;
  float: left;
  width: 650px;
  line-height: 30px;
}
.confirmOrder .content .section-products .products-list li .pro-price {
  float: left;
  width: 150px;
  text-align: center;
  line-height: 30px;
}
.confirmOrder .content .section-products .products-list li .pro-total {
  float: left;
  width: 190px;
  text-align: center;
  color: #ff6700;
  line-height: 30px;
}
/* 商品CSS END */

/* 结算列表CSS */
.confirmOrder .content .section-count {
  margin: 0 48px;
  padding: 20px 0;
  overflow: hidden;
}
.confirmOrder .content .section-count .money-box {
  float: right;
  text-align: right;
}
.confirmOrder .content .section-count .money-box .title {
  float: left;
  width: 126px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #757575;
}
.confirmOrder .content .section-count .money-box .value {
  float: left;
  min-width: 105px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #ff6700;
}
.confirmOrder .content .section-count .money-box .total .title {
  padding-top: 15px;
}
.confirmOrder .content .section-count .money-box .total .value {
  padding-top: 10px;
}
.confirmOrder .content .section-count .money-box .total-price {
  font-size: 30px;
}
/* 结算列表CSS END */

/* 结算导航CSS */
.confirmOrder .content .section-bar {
  padding: 20px 48px;
  border-top: 2px solid #f5f5f5;
  overflow: hidden;
}
.confirmOrder .content .section-bar .btn {
  float: right;
}
.confirmOrder .content .section-bar .btn .btn-base {
  float: left;
  margin-left: 30px;
  width: 158px;
  height: 38px;
  border: 1px solid #b0b0b0;
  font-size: 14px;
  line-height: 38px;
  text-align: center;
}
.confirmOrder .content .section-bar .btn .btn-return {
  color: rgba(0, 0, 0, 0.27);
  border-color: rgba(0, 0, 0, 0.27);
}
.confirmOrder .content .section-bar .btn .btn-primary {
  background: #ff6700;
  border-color: #ff6700;
  color: #fff;
}
/* 结算导航CSS */
/* 主要内容容器CSS END */
</style>