<template>
  <div id="storeList" class="storeList">
    <ul>
      <li v-for="item in storeList" :key="item.storeId">
        <router-link :to="{ path: '/stores/details', query: {storeID:item.storeId} }">
          <img :src="item.storeImage" alt />
          <h3><i class="iconfont icon-dianpu"></i>{{item.storeName}}</h3>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "StoreList",
  props:['storeList'],
}
</script>

<style scoped>
.storeList ul li {
  z-index: 1;
  float: left;
  width: 295px;
  height: 210px;
  padding: 10px 0;
  margin: 0 0 14.5px 13.7px;
  background-color: white;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  position: relative;
}
.storeList ul li:hover {
  z-index: 2;
  -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  -webkit-transform: translate3d(0, -2px, 0);
  transform: translate3d(0, -2px, 0);
}
.storeList ul li img {
  display: block;
  width: 160px;
  height: 160px;
  background: url(../assets/images/placeholder.png) no-repeat 50%;
  margin: 0 auto;
}
.storeList ul li h2 {
  margin: 25px 10px 0;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.storeList ul li h3 {
  margin: 16px 10px;
  height: 18px;
  font-size: 15px;
  font-weight: 400;
  color: #b0b0b0;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>