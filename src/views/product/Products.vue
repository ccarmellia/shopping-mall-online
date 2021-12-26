<template>
  <div class="products" id="products">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>全部商品</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">搜索</el-breadcrumb-item>
        <el-breadcrumb-item v-else>分类</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">{{search}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 面包屑END -->

    <!-- 分类标签 -->
    <div class="nav">
      <div class="product-nav">
        <div class="title">分类</div>
        <el-tabs v-model="activeName" type="card">

          <el-tab-pane
              v-for="type in typeList"
              :key="type.typeId"
              :label="type.typeName"
              :name="''+type.typeId"
          ><span slot="label"><i :class="type.typeIcon"></i> {{type.typeName}}</span></el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 分类标签END -->

    <!-- 主要内容区 -->
    <div class="main">
      <div class="product-lists"> <!--这个不能为list不然会有冲突，bug-->
        <ProductList :productList="productList" v-if="productList.length>0"></ProductList>
        <div v-else class="none-product">抱歉没有找到相关的商品，请看看其他的商品</div>
      </div>
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
      <!-- 分页END -->
    </div>
    <!-- 主要内容区END -->
  </div>
</template>

<script>
export default {
  name: "product",
  data(){
    return{
      typeList:"",  //类型列表
      typeID:[],//商品类型id
      productList:"",//商品列表
      total: 0, // 商品总量
      pageSize: 15, // 每页显示的商品数量
      currentPage: 1, //当前页码
      activeName: "-1", // 分类列表当前选中的类型
      search:"", //搜索条件
    }
  },
  created() {
    //获取全部商品类型
    this.getTypeList();
  },
  activated() {
    this.activeName = "-1"; //初始化分类列表当前选中的id为-1
    this.total = 0; //初始化商品总量为0
    this.currentPage = 1; //初始化当前页码为1
    //如果路由没有传递参数,默认为显示全部商品
    if(Object.keys(this.$route.query).length == 0){
      this.typeID = [];
      this.activeName = "0";
      return ;
    }
    //如果路由传递了typeID,则显示对应类别的商品
    if(this.$route.query.typeID != undefined){
      this.typeID = this.$route.query.typeID;
      if(this.typeID.length ==1){
        this.activeName = "" + this.typeID[0];
      }
      return ;
    }
    //如果路由传递了search,则为搜索,显示对应类别
    if(this.$route.query.search != undefined){
      this.search = this.$route.query.search;
    }
  },
  watch:{
    //监听点击了那个类别标签,通过修改类别id,显示对应商品
    activeName: function (val) {
      if (val == 0){
        this.typeID = [];
      }
      if(val >0){
        this.typeID = [Number(val)]; //将val转换为数字
      }
      //初始化商品总量和页码
      this.total = 0;
      this.currentPage = 1;
      //更新地址栏链接,不然刷新页面 页面会变,不会保持原来页面
      this.$router.push({path:"/products",query:{typeID:this.typeID}});

    },
    // 监听搜索条件，响应相应的商品
    search: function(val) {
      if (val != "") {
        this.getProductBySearch(val);
      }
    },
    //监听分类id,响应对应类别的商品
    typeID:function (){
      this.getProduct();
      this.search = "";
    },
    //监听路由编号,更新路由传递条件
    $route:function (val){
      if (val.path == "/products") {
        if (val.query.search != undefined) {
          this.activeName = "-1";
          this.currentPage = 1;
          this.total = 0;
          this.search = val.query.search;
        }
      }
    }
  },
  methods:{
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
      if(this.search !=""){
        this.getProductBySearch();
      }else {
        this.getProduct();
      }
      this.backTop();
    },
    //获取类型列表数据
    getTypeList(){
        this.postRequest('/type/getTypeList',{}).then(resp =>{
          const val = {
            typeId: 0,
            typeName: "全部"
          };
          const lists = resp.data.typeList;
          lists.unshift(val);
          this.typeList = lists;
          console.log(lists);

        })
        .catch(err => {
          return Promise.reject(err);
        });

    },
    //获取全部商品或者指定类型商品数据
    getProduct(){
      //如果类型列表为空则请求全部商品数据,否则请求指定类型商品数据
      const api = this.typeID.length == 0
        ? "/product/getAllProduct"
        : "product/getProductByType";
      const productTypeVo = {
        typeID: this.typeID[0],
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.postRequest(api,productTypeVo)
      .then(resp =>{
        this.productList = resp.data.productList;
        this.total = Number(resp.data.total); //total的类型是Number,需要转换
      })
      .catch(err =>{
        return Promise.reject(err);
      })
    },
    // 通过搜索条件获取商品数据
    getProductBySearch(){
      const productSearchVo = {
        search: this.search,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }

      this.postRequest("/product/getProductBySearch",productSearchVo)
      .then(resp =>{
        this.productList =resp.data.productList;
        this.total = Number(resp.data.total); //total的类型是Number,需要转换
      })
      .catch(err =>{
        return Promise.reject(err);
      });
    }
  }
}
</script>

<style scoped>
.products {
  background-color: #f5f5f5;
}
/* 面包屑CSS */
/*.el-tabs--card .el-tabs__header {*/
/*  border-bottom: none;*/
/*}*/
.products .breadcrumb {
  height: 50px;
  background-color: white;
}
.products .breadcrumb .el-breadcrumb {
  width: 1225px;
  line-height: 30px;
  font-size: 16px;
  margin: 0 auto;
}
/* 面包屑CSS END */

/* 分类标签CSS */
.products .nav {
  background-color: white;
}
.products .nav .product-nav {
  width: 1225px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
}
.nav .product-nav .title {
  width: 50px;
  font-size: 16px;
  font-weight: 700;
  float: left;
}
/* 分类标签CSS END */

/* 主要内容区CSS */
.products .main {
  margin: 0 auto;
  max-width: 1225px;
}
.products .main .product-lists {
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: -13.7px;
  overflow: auto;
}
.products .main .pagination {
  height: 50px;
  text-align: center;
}
.products .main .none-product {
  color: #333;
  margin-left: 13.7px;
}
/* 主要内容区CSS END */
</style>