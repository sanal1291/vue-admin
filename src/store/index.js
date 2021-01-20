import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from './modules/sidebar'
import auth from './modules/auth'
import packages from './modules/package'
// import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    sidebar,
    auth,
    packages,
  }
})
