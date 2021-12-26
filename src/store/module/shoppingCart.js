


export default {
    state:{
        shoppingCart:[],
        //shoppingCart 这里和订单共用一张表
        /*
        shoppingCart = {
            orderId: "", //订单id
            productId: "", //商品id
            productName:"",//商品名称
            productImage: "", //商品图片
            productPrice: "", //商品价格
            productCount: "", //订单的商品的数量
            maxCount: "", //商品限购数量
            check:false //是否勾选
        }
        */
    },
    getters:{
        getShoppingCart (state){
            //获取购物车状态
            return state.shoppingCart;
        },
        getCount (state){
            //购物车商品总数量
            let totalCount = 0;
            for (let i = 0;i < state.shoppingCart.length;i++){
                const temp = state.shoppingCart[i];
                totalCount += temp.productCount;
            }
            return totalCount;
        },
        getIsAllCheck (state){
            //判断是否全部勾选
            for (let i = 0; i < state.shoppingCart.length;i++){
                const temp = state.shoppingCart[i];
                if(!temp.check){
                    return false;
                }
            }
            return true;
        },
        getProductsChecked (state){
            //获取勾选商品的信息
            let productsChecked = [];
            for (let i = 0;i < state.shoppingCart.length; i++){
                const temp = state.shoppingCart[i];
                if (temp.check){
                    productsChecked.push(temp);
                }
            }
            return productsChecked;
        },
        getCheckCount (state){
            //获取购物车勾选的商品数量
            let totalCount = 0;
            for (let i = 0;i < state.shoppingCart.length;i++){
                const temp = state.shoppingCart[i];
                if(temp.check){
                    totalCount += temp.productCount;
                }
            }
            return totalCount;
        },
        getTotalPrice (state){
            //获取购物车勾选商品的总价格
            let totalPrice = 0;
            for (let i = 0;i < state.shoppingCart.length;i++){
                const temp = state.shoppingCart[i];
                if(temp.check){
                    totalPrice += Number(parseFloat((temp.productCount * temp.productPrice).toFixed(2)));
                }
            }
            return totalPrice;
        },
    },
    mutations:{
        setShoppingCart (state,data){
            //设置购物车状态
            state.shoppingCart = data;
        },
        unshiftShoppingCart (state,data){
            //添加购物车
            state.shoppingCart.unshift(data);
        },
        updateShoppingCart (state,payload){
            //更新购物车
            //更新购物车内勾选状态(check)和商品数量(productCount)
            if(payload.prop == "productCount"){
                //判断商品数量是否小于一或大于最大值
                if(payload.val < 1){
                    return;
                }
                if(payload.val > state.shoppingCart[payload.key].maxCount){
                    return;
                }
            }
            //更新购物车对应索引的属性
            state.shoppingCart[payload.key][payload.prop] = payload.val;
        },
        addProductCount (state,productId){
            //根据商品id增加购物内的商品数量
            //由于添加购物车时,该商品可能已经存在于购物车,只用数量加1即可
            for (let i = 0;i < state.shoppingCart.length;i++){
                const temp = state.shoppingCart[i];
                if(temp.productId == productId){
                    if(temp.productCount < temp.maxCount){
                        temp.productCount++;
                    }
                }
            }
        },
        deleteShoppingCart (state,orderId){
            //根据订单id删除购物车内商品,
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i];
                if (temp.orderId == orderId) {
                    state.shoppingCart.splice(i, 1);
                }
            }
        },
        checkAll (state, data) {
            // 点击全选按钮，更新每个商品的勾选状态
            for (let i = 0; i < state.shoppingCart.length; i++) {
                state.shoppingCart[i].check = data;
            }
        },
    },
    actions: {
        setShoppingCart ({ commit }, data) {
            commit('setShoppingCart', data);
        },
        unshiftShoppingCart ({ commit }, data) {
            commit('unshiftShoppingCart', data);
        },
        updateShoppingCart ({ commit }, payload) {
            commit('updateShoppingCart', payload);
        },
        addProductCount ({ commit }, productId) {
            commit('addProductCount', productId);
        },
        deleteShoppingCart ({ commit }, orderId) {
            commit('deleteShoppingCart', orderId);
        },
        checkAll ({ commit }, data) {
            commit('checkAll', data);
        }
    }
}