import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from './modules/sidebar'
import auth from './modules/auth'
import packagez from './modules/packagez'
import { categoryCollection, packageCollection } from '../firebase'
// import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sidebar,
    auth,
    packagez,
  },
  state: {
    packages: [],
    indiItems: [],
    categories: [],

  },
  mutations: {
    setPackages(state, packages) {
      state.packages = packages;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setIndiItems(state, indiItems) {
      state.indiItems = indiItems;
    },
  },
  actions: {
    setPackages({ commit, state }) {
      if (state.packages.length === 0) {
        packageCollection.onSnapshot((snapshot) => {
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
        })
      }
    },
    setCategories({ commit, state }) {
      if (state.categories.length === 0) {
        categoryCollection.onSnapshot((snapshot) => {
          let categories = []
          snapshot.forEach((doc) => {
            categories.push({
              id: doc.id,
              name: doc.get("name"),
              displayNames: doc.get('displayNames'),
              img: doc.get('imageUrl'),
              priority: doc.get('priority'),
            })
          })
          commit("setCategories", categories)
        })
      }
    },
    // setIndiItems({ commit }) {
    //   indipendentItemCollection.onSnapshot((snapshot) => {
    //     let indiItems = []
    //     snapshot.forEach((doc) => {
    //       indiItems.push({
    //         id: doc.id,
    //         displayName: doc.get('displayName'),
    //         img: doc.get('imageUrl'),
    //         category: doc.get('category'),
    //         price: doc.get('price'),
    //         unit: doc.get('unitMeasured'),
    //         inStock: doc.get('inStock')
    //       })
    //     })
    //     commit("setIndiItems", indiItems)

    //   })
    // }
  }
})
