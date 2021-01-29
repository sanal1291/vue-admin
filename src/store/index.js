import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from './modules/sidebar'
import auth from './modules/auth'
import packagez from './modules/packagez'
import { packageCollection } from '../firebase'
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

  },
  mutations: {
    setPackages(state, packages) {
      state.packages = packages;
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
