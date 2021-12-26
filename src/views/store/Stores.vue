<template>
    <div class="stores" id="stores">
      <!-- 面包屑 -->
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>全部店铺</el-breadcrumb-item>
          <el-breadcrumb-item v-if="search">搜索</el-breadcrumb-item>
<!--          <el-breadcrumb-item v-else>分类</el-breadcrumb-item>-->
          <el-breadcrumb-item v-if="search">{{search}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 面包屑END -->

      <!-- 主要内容区 -->
      <div class="main">
        <div class="store-lists"> <!--这个不能为list不然会有冲突，bug-->
          <StoreList :storeList="storeList" v-if="storeList.length>0"></StoreList>
          <div v-else class="none-store">抱歉没有找到相关的店铺，请看看其他的店铺</div>
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
    </div>
</template>

<script>
export default {
  name: "Stores",
  data(){
    return{
      storeList:"", //店铺列表
      total: 0, // 店铺总量
      pageSize: 8, // 每页显示的店铺数量,
      search:"" //搜索条件
    }
  },
  activated() {
    this.total = 0; //初始化店铺总量为0
    this.currentPage = 1; //初始化当前页码为1
    this.getStore();
    //如果路由传递了search,则为搜索,显示对应类别
    if(this.$route.query.search != undefined){
      this.search = this.$route.query.search;
    }
  },
  watch:{
    search:function (val){
      if(val != ""){
        this.getStoreBySearch(val);
      }
    },
    //监听路由编号,更新路由传递条件
    $route: function(val) {
      if (val.path == "/stores") {
        if (val.query.search != undefined) {
          this.total = 0;
          this.currentPage = 1;
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
        this.getStoreBySearch();
      }else {
        this.getStore();
      }
      this.backTop();
    },
    //获取全部店铺
    getStore(){
      console.log(666);
      const storeSearchVo = {
        search:"",
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      console.log(storeSearchVo);
      console.log(666);
      this.postRequest("/store/getAllStore",storeSearchVo)
          .then(resp =>{
            this.storeList = resp.data.storeList;
            this.total = Number(resp.data.total); //total的类型是Number,需要转换
          })
          .catch(err =>{
            return Promise.reject(err);
          })
    },
    //根据搜索条件获取店铺
    getStoreBySearch(){
      const storeSearchVo = {
        search:this.search,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.postRequest("/store/getStoreBySearch",storeSearchVo)
          .then(resp =>{
            this.storeList = resp.data.storeList;
            this.total = Number(resp.data.total); //total的类型是Number,需要转换
          })
          .catch(err =>{
            return Promise.reject(err);
          })
    }
  }
}
</script>

<style scoped>
.stores {
  background-color: #f5f5f5;
}
/* 面包屑CSS */
/*.el-tabs--card .el-tabs__header {*/
/*  border-bottom: none;*/
/*}*/
.stores .breadcrumb {
  height: 50px;
  background-color: white;
}
.stores .breadcrumb .el-breadcrumb {
  width: 1225px;
  line-height: 30px;
  font-size: 16px;
  margin: 0 auto;
}
/* 面包屑CSS END */


/* 主要内容区CSS */
.stores .main {
  margin: 0 auto;
  max-width: 1225px;
}
.stores .main .store-lists {
  min-height: 420px;
  padding-top: 14.5px;
  margin-left: -13.7px;
  overflow: auto;
}
.stores .main .pagination {
  height: 50px;
  text-align: center;
}
.stores .main .none-store {
  color: #333;
  margin-left: 13.7px;
}
</style>