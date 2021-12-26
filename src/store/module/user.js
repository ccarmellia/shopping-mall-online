
export default {
    state: {
        // 存储token
        Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
        user: "", // 登录的用户
    },
    mutations: {
        // 修改token，
        changeLogin (state, data) {
            state.Authorization = data;
        },
        //更新用户状态
        setUser (state, data) {
            state.user = data;
        },
        //更新用户头像
        updateAvatar (state,data){
            state.user.cusImage = data;
            let user = JSON.parse(localStorage.getItem("user"));
            user["cusImage"] = data;
            localStorage.setItem("user",JSON.stringify(user));
        },
        //更新用户身份
        updateStatus(state,data){
            state.user.cusStatus = data;
            let user = JSON.parse(localStorage.getItem("user"));
            user["cusStatus"] = data;
            localStorage.setItem("user",JSON.stringify(user));
        },
        //更新用户余额
        updateProperty(state,data){
            state.user.cusProperty = data;
            let user = JSON.parse(localStorage.getItem("user"));
            user["cusProperty"] = data;
            localStorage.setItem("user",JSON.stringify(user));
        }
    },
    actions:{
        //更新用户状态
        setUser ({ commit }, data) {
            commit('setUser', data);
        },
        //更新token
        changeLogin ({commit}, data) {
            commit('changeLogin',data)
        },
        //更新用户头像
        updateAvatar({ commit },data){
            commit('updateAvatar',data);
        },
        //更新用户头像
        updateStatus({ commit },data){
            commit('updateStatus',data);
        },
        //更新用户资产
        updateProperty({ commit },data) {
            commit('updateProperty',data);
        }

    },
    getters: {
        getUser(state) {
            return state.user
        },
        getToken(state){
            return state.Authorization
        }
    }
}