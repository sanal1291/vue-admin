import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from './modules/sidebar'
import auth from './modules/auth'
import packagez from './modules/packagez'
import indiItem from './modules/indiItem'
import item from './modules/item'
import orders from './modules/orders'
import carousel from './modules/carousel'
import settings from './modules/settings'
import users from './modules/users'
import { categoryCollection, indipendentItemCollection, ItemCollection, packageCollection } from '../firebase'
// import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sidebar,
    auth,
    packagez,
    indiItem,
    item,
    orders,
    carousel,
    settings,
    users,
  },
  state: {
    routeName: null,
    snapshots: [],
    packages: [],
    categories: [],

  },
  mutations: {
    setRouteName(state, name) {
      state.routeName = name;
    },
    setPackages(state, packages) {
      state.packages = packages;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
  },
  actions: {
    setPackages({ commit, state }) {
      if (state.packages.length === 0) {
        state.snapshots.push(packageCollection.onSnapshot((snapshot) => {
          let packages = []
          snapshot.forEach((doc) => {
            packages.push({
              id: doc.id,
              name: doc.get('name'),
              displayNames: doc.get('displayNames'),
              img: doc.get('image'),
              items: doc.get('items'),
              price: doc.get('price'),
              total: doc.get('total')
            })
          })
          commit("setPackages", packages)
        }))
      }
    },
    setCategories({ commit, state }) {
      if (state.categories.length === 0) {
        state.snapshots.push(categoryCollection.onSnapshot((snapshot) => {
          let categories = []
          snapshot.forEach((doc) => {
            categories.push({
              id: doc.id,
              displayNames: doc.get('displayNames'),
              img: doc.get('imageUrl'),
              priority: doc.get('priority'),
            })
          })
          commit("setCategories", categories)
        }))
      }
    },
    setRouteName({ commit }, name) {
      commit('setRouteName', name)
    }
  }
})
