import { indipendentItemCollection } from "../../firebase";

export default {
    state: {
        searchItems: null,
        items: null,
        searchLast: null,
        itemLast: null,
    },

    //  mutations
    mutations: {
        setSearchItems(state, value) {
            state.searchItems = [...state.searchArray, ...value];
        },
        setsearchLast(state, value) {
            state.searchLast = value;
        },
        setItems(state, value) {
            state.items = [...state.items, ...value];
        },
        setItemLast(state, value) {
            state.itemLast = value;
        },
    },

    // actions 
    actions: {
        getItems({ commit, state }) {
            var itemColl;
            if (state.items.length === 0) {
                itemColl = indipendentItemCollection.orderBy('name').limit(25)
            } else {
                itemColl = indipendentItemCollection.orderBy('name').startAfter(state.itemLast).limit(25)
            }
            itemColl.get().then((querySnapshot) => {
                var items = [];
                querySnapshot.forEach(doc => {
                    items.push({
                        id: doc.id,
                        name: doc.get('name'),
                        categories: doc.get('categories'),
                        stock_quantity: doc.get('stock_quantity'),
                        price: doc.get('price'),
                    })
                })
                var item = querySnapshot.docs[querySnapshot.docs.length - 1]
                commit("setItemLast", item)
                commit("setItems", items)
            })
        },
        getSearchItems({ commit, state }) {
            var itemColl;
            if (state.searchItems.length === 0) {
                itemColl = indipendentItemCollection.orderBy('name').limit(25)
            } else {
                itemColl = indipendentItemCollection.orderBy('name').startAfter(state.searchLast).limit(25)
            }
            itemColl.get().then(querySnapshot => {
                var items = [];
                querySnapshot.forEach(doc => {
                    items.push({
                        id: doc.id,
                        name: doc.get('name'),
                        categories: doc.get('categories'),
                        stock_quantity: doc.get('stock_quantity'),
                        price: doc.get('price'),
                    })
                })
                var item = querySnapshot.docs[querySnapshot.docs.length - 1]
                commit("setsearchLast", item)
                commit("setSearchItems", items)
            })
        },
    },



}