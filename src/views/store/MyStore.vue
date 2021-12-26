<template>
    <div class="myStore" id="myStore">
          <span>我的店铺</span>
          <el-container>
            <el-header >
              <el-menu
                  default-active="/myStore"
                  class="el-menu-demo"
                  mode="horizontal"
                  background-color="#11ff11"
                  text-color="#fff"
                  active-text-color="#ffd04b"
                  router>
                <el-menu-item index="/addProduct">添加商品</el-menu-item>
                <el-menu-item index="/deleteProduct">删除商品</el-menu-item>
              </el-menu>
            </el-header>

            <el-main style="min-height: 600px;margin: 0 auto">
              <keep-alive >
                <router-view></router-view>
              </keep-alive>
            </el-main>
          </el-container>

    </div>
</template>

<script>
export default {
  name: "MyStore",
}
</script>

<style scoped>
.myStore{
  width: 1225px;
}
.myStore .el-header .el-menu {
  max-width: 200px;
  margin: 0 auto;
}
.el-menu-vertical-demo el-menu-item{
  /*padding:50px;*/
  display: flex;
}
</style>