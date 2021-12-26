import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user';
import shoppingCart from './module/shoppingCart';

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    modules: {
        user,
        shoppingCart
    }
})


