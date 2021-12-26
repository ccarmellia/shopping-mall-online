<template>
    <div id="commentList" class="commentList">
      <ul>
        <li v-for="(item,i) in commentList">
          <div class="content">
            <div class="head">
              <img v-if="item.cusImage" :src="item.cusImage" style="vertical-align:middle;border-radius:50%;width:40px;height:40px" >
              <img v-else src="../assets/images/defaultAvatar.png">
              <span style="margin-left: 5px">{{item.cusName}}</span>
            </div>
            <div class="body">
              <p>{{item.commentDetail}}</p>
              <span>评论时间:{{item.commentTime}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
export default {
  name: "Comment",
  props:['commentList'],
}
</script>

<style scoped>
.commentList {
  width: 1225px;
  margin-top: 4px;
}
.commentList ul{
  line-height: 30px;
}
.commentList ul li{
  margin-bottom: 30px;
}
.commentList .head{
  font-size: 14px;
}
.commentList .body{
  font-size: 13px;
  text-indent: 2em;
}
</style>