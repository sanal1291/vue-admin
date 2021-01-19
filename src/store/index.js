import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from '../firebase'
import router from '../router'
// import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userProfile: {}
  },
  mutations: {
    setUser(state, val) {
      state.user = val.user.email
    }
  },
  actions: {
    async login({ commit }, form) {
      const user = await auth.signInWithEmailAndPassword(form.email, form.password)
      // console.log(user)
      commit('setUser', user)
      router.push("/dashboard")
    },
    async logout() {
      await auth.signOut()
      router.push('/')
    }
  },
  modules: {
  }
})
