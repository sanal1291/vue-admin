import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'

Vue.config.productionTip = false

let app
auth.onAuthStateChanged(() => {
  if (!app) {
    app =
      new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount('#app')
  }
})
