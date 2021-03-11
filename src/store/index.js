import Vue from 'vue'
import Vuex from 'vuex'
import sidebar from './modules/sidebar'
import auth from './modules/auth'
import packagez from './modules/packagez'
import indiItem from './modules/indiItem'
import { categoryCollection, indipendentItemCollection, ItemCollection, packageCollection } from '../firebase'
// import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sidebar,
    auth,
    packagez,
    indiItem,
  },
  state: {
    packages: [],
    indiItems: [],
    categories: [],
    items: [],
    lastItemDoc: null,
    lastIndiItemDoc: null,

  },
  mutations: {
    setPackages(state, packages) {
      state.packages = packages;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setIndiItems(state, indiItems) {
      state.indiItems = [...state.indiItems, ...indiItems];
    },
    setLastIndiItemDoc(state, item) {
      state.lastIndiItemDoc = item;
    },
    setItems(state, items) {
      state.items = [...state.items, ...items];
    },
    setLastItemDoc(state, item) {
      state.lastItemDoc = item;
    }
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
              displayNames: doc.get('displayNames'),
              img: doc.get('imageUrl'),
              priority: doc.get('priority'),
            })
          })
          commit("setCategories", categories)
        })
      }
    },
    setItems({ commit, state }) {
      var itemColl;
      if (state.items.length === 0) {
        itemColl = ItemCollection.orderBy('name').limit(25);
      } else {
        itemColl = ItemCollection.orderBy('name').startAfter(state.lastItemDoc).limit(25)
      }
      itemColl.get().then((querySnapshot) => {
        var items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            name: doc.get('name'),
            displayName: doc.get('displayName'),
            imageUrl: doc.get('imageUrl'),
            varieties: doc.get('varieties'),
            category: doc.get('category')
          })
        })
        var item = querySnapshot.docs[querySnapshot.docs.length - 1]
        commit("setLastItemDoc", item)
        commit("setItems", items)

      })
    },
    setIndiItems({ commit, state }) {
      var itemColl;
      if (state.indiItems.length === 0) {
        itemColl = indipendentItemCollection.orderBy('name').limit(25)
      } else {
        itemColl = indipendentItemCollection.orderBy('name').startAfter(state.lastIndiItemDoc).limit(25)
      }
      itemColl.get().then((querySnapshot) => {
        var items = [];
        querySnapshot.forEach(doc => {
          items.push({
            id: doc.id,
            name: doc.get('name'),
            displayNames: doc.get('displayName'),
            category: doc.get('category'),
            imageUrl: doc.get('imageUrl'),
            inStock: doc.get('inStock'),
            price: doc.get('price'),
            rank: doc.get('rank'),
            unitMeasured: doc.get('unitMeasured')
          })
        })
        var item = querySnapshot.docs[querySnapshot.docs.length - 1]
        commit("setLastIndiItemDoc", item)
        commit("setIndiItems", items)
      })
    }
  }
})
