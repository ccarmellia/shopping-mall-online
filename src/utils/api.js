import axios from "axios";
// .js文件使用message需要这样导入,.vue文件只需要this.$message即可
import { Message } from "element-ui";
import router from "../router";










//路径前缀,我们这里没用就为""
let base = "";

//传送json格式的post请求
export const postRequest = (url,params) =>{
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
export const postForm = (url,params,config) =>{
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        config:config
    })
}
//封装get请求
export const getRequest = (url, params) => {
    //请求后端接口
    return axios({
        //请求方法 get 方法
        method: 'get',
        //请求路径
        url: `${base}${url}`,
        //数据
        data: params,
    })
}
//封装delete请求
export const deleteRequest = (url, params) => {
    //请求后端接口
    return axios({
        //请求方法 delete 方法
        method: 'delete',
        //请求路径
        url: `${base}${url}`,
        //数据
        data: params
    })
}