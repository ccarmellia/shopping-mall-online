<template>
    <div id="productDetails">
      商品信息
      <!--商品信息区-->
      <div class="product">
        <!--左侧为商品图片-->
        <div class="bigPicture">
          <el-image
              style="height:300px"
              :src="productDetails.productImage"
              :preview-src-list="srcList">
          </el-image>
        </div>
        <!-- 右侧内容区 -->
        <div class="content">
          <p class="productName">{{productDetails.productName}}</p>
          <router-link :to="{path:'/stores/details', query: {storeID:productDetails.storeId} }" title="点击进入店铺">
            <p class="storeName">{{productDetails.storeName}}</p>
          </router-link>
          <div class="productPrice">
            <span>{{productDetails.productPrice}}元</span>
          </div>
          <div class="productExist">
            <span>库存:{{productDetails.productExist}}</span>
            <span>销量:{{productDetails.productSalesVolume}}</span>
          </div>
          <!-- 加入购物车按钮 -->
          <div class="button">
            <el-button class="shop-cart" :disabled="limit" @click="addShoppingCart">加入购物车</el-button>
          </div>
        </div>
      </div>

      <div class="comment">
          <h3>评论区</h3>
          <h4>发表评论 --- {{ this.$store.getters.getUser.cusName}}</h4><span>共有{{this.total}}条评论</span>
          <hr>
<!--          <textarea placeholder="请输入要BB的内容（最多吐槽200字）" maxlength="200" v-model="myComment"></textarea>-->
        <el-input
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入评论的内容（最多吐槽200字）"
            v-model="myComment">
        </el-input>
          <el-button  type="primary" size="large" @click="postComment">发表评论</el-button>
          <!--评论区-->
          <Comment :commentList="commentList" v-if="commentList.length>0"></Comment>
          <div v-else class="none-comment"><span style="margin-left: 20px">该商品还没有评论,你可以成为第一个</span></div>
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="currentChange"
            ></el-pagination>
          </div>
      </div>
    </div>
</template>

<script>
import {postRequest} from "../../utils/api";
import {mapActions} from "vuex";

export default {
  name: "ProductDetail",
  data(){
    return{
      limit:false,//限制添加购物车
      myComment:"",//我将要写的评论
      pageSize:5,
      total:0,
      currentPage:1,
      productID:"",//商品id
      productDetails:"",//商品详细信息
      commentList:"",//评论列表,
      srcList:[],
    }
  },
  activated() {
    // this.total = 0; //初始化商品总量为0
    // this.currentPage = 1; //初始化当前页码为1
    if (this.$route.query.productID != undefined) {
      this.productID = this.$route.query.productID;
    }

  },
  watch: {
    // 监听商品id的变化，请求后端获取商品数据
    productID: function(val) {
      // 初始化商品总量和当前页码
      this.total = 0;
      this.currentPage = 1;
      this.myComment = '',
      this.getProductDetails(val);
      this.getComments();

    }
  },
  methods:{
    ...mapActions(["unshiftShoppingCart","addProductCount"]),
    //更换页码返回顶部
    backTop(){
      const timer = setInterval(function () {
        const top = document.documentElement.scrollTop || document.body.scrollTop;
        const speed = Math.floor(-top / 10); //滑条滑动速度
        document.documentElement.scrollTop = document.body.scrollTop = top + speed;
        if (top === 0){
          clearInterval(timer);
        }
      },20);
    },
    //页码变化调用currentChange方法
    currentChange(currentPage){
      this.currentPage = currentPage;
      this.getComments();
      this.backTop();
    },
    getProductDetails(val){
      this.postRequest("/product/getProductDetail",val).then(resp =>{
        this.productDetails = resp.data.productDetails;
        this.srcList = resp.data.srcList;

      }).catch(err =>{
        return Promise.reject(err);
      });

    },
    //获取该商品全部评论
    getComments(){

      const commentProductVo = {
        productID:this.productID,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.postRequest("/comment/getComments",commentProductVo).then(resp =>{
        this.commentList = resp.data.commentList;
        this.total = Number(resp.data.total); //total的类型是Number,需要转换
      }).catch(err =>{
        return Promise.reject(err);
      });
    },
    //提交评论
    postComment(){
      if (!this.$store.getters.getUser) {
        this.$message.error("请登录后评论");
        return;
      }
      if(this.myComment==''){
        this.$message.warning("评论内容不能为空");
      }
      //获取当前时间,转换时间格式为yyyy-MM-dd hh:mm:ss
      // let date = new Date();
      // let year = date.getFullYear(); //月份从0~11，所以加一
      // let dateArr = [date.getMonth() + 1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds()];
      // for(let i=0;i<dateArr.length;i++){
      //   if (dateArr[i] >= 1 && dateArr[i] <= 9) {
      //     dateArr[i] = "0" + dateArr[i];
      //   }
      // }
      // let commentTime = year+'-'+dateArr[0]+'-'+dateArr[1]+' '+dateArr[2]+':'+dateArr[3]+':'+dateArr[4];
      const commentAddVo = {
        commentDetail: this.myComment,
        commentTime:new Date(),//直接提交时间,格式交给后端处理
        productId:this.productID,
        cusId:this.$store.getters.getUser.cusId
      }
      console.log(commentAddVo);
      this.postRequest("/comment/addComment",commentAddVo).then(resp =>{
        if(resp.data.status==='success'){
          this.myComment = '';
          this.getComments();
        }else {
          this.$message.error("评论失败")
        }
      })
    },
    //添加至购物车
    addShoppingCart(){
      //判断用户是否登录,没有登录则提示先登录
      if(!this.$store.getters.getUser){
        this.$message.warning("请先登录后再添加");
        return;
      }
      const adShoppingCartVo = {
        cusId:this.$store.getters.getUser.cusId,
            productId:this.productID
      }

      this.postRequest("/order/addShoppingCart",adShoppingCartVo).then(resp =>{
        if(resp.data.status == "success"){
          //该商品第一次加入
          this.unshiftShoppingCart(resp.data.shoppingCart)
          this.$notify.success("商品添加成功");
        }else if(resp.data.status == "exist"){
          //该商品已经在购物车,数量加一
          this.addProductCount(this.productID);
          this.$notify.success("该商品已经在购物车,数量加1");
        }else if(resp.data.status == "exceed"){
          //商品达到最大数量
          this.limit = true;
          this.$notify.warning("商品已经添加到最大数量了,不能再买了");
        }else {
          this.$notify.error("加入购物车失败");
        }
      })
      .catch(err =>{
        return Promise.reject(err);
      })
    }

  }
}
</script>

<style scoped>
/* 主要内容CSS */
#productDetails .product {
  width: 1225px;
  height: 400px;
  padding-top: 30px;
  margin: 0 auto;
}
#productDetails .product .bigPicture {
  float: left;
  width: 300px;
  height: 300px;
}
#productDetails .product .content {
  float: left;
  margin-left: 25px;
  width: 640px;
}
#productDetails .product .content .productName {
  color: #b0b0b0;
  padding-top: 10px;
}
#productDetails .product .content .storeName {
  color: #ff6700;
  padding-top: 10px;
}
#productDetails .product .content .productPrice {
  display: block;
  font-size: 18px;
  color: #ff6700;
  border-bottom: 1px solid #e0e0e0;
  padding: 25px 0 25px;
}
#productDetails .product .content .productExist{
  margin-right: 20px;
}
#productDetails .product .content .button {
  height: 55px;
  margin: 10px 0 20px 0;
}
#productDetails .product .content .button .el-button {
  float: left;
  height: 55px;
  font-size: 16px;
  color: #fff;
  border: none;
  text-align: center;
}
#productDetails .product .content .button .shop-cart {
  width: 340px;
  background-color: #ff6700;
}
#productDetails .product .content .button .shop-cart:hover {
  background-color: #f25807;
}

/* 评论区CSS*/
textarea {
  font-size: 14px;
  margin: 0;
}
#productDetails .product .comment{
  width: 1225px;
}
.productDetails .product .content .none-comment {
  color: #333;
  margin-left: 13.7px;
}
</style>