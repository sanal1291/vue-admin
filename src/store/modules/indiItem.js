import { indipendentItemCollection } from "../../firebase";

export default {
    state: {
        searchIndiItems: [],
        indiItems: [],
        searchIndiLast: null,
        itemIndiLast: null,
    },

    //  mutations
    mutations: {
        setSearchIndiItems(state, value) {
            state.searchIndiItems = [...state.searchIndiItems, ...value];
        },
        setsearchIndiLast(state, value) {
            state.searchIndiLast = value;
        },
        setIndiItems(state, value) {
            state.indiItems = [...state.indiItems, ...value];
        },
        setItemIndiLast(state, value) {
            state.itemIndiLast = value;
        },
    },

    // actions 
    actions: {
        getIndiItems({ commit, state }) {
            var itemColl;
            if (state.indiItems && state.indiItems.length === 0) {
                state.itemIndiLast = null
                itemColl = indipendentItemCollection.orderBy('name').limit(25)
            } else {
                if (state.itemIndiLast) {
                    itemColl = indipendentItemCollection.orderBy('name').startAfter(state.itemIndiLast).limit(25)
                }
                else {
                    return
                }
            }
            itemColl.get().then((querySnapshot) => {
                var items = [];
                querySnapshot.forEach(doc => {
                    items.push({
                        id: doc.id,
                        ...doc.data(),
                    })
                })
                var item = querySnapshot.docs[querySnapshot.docs.length - 1]
                commit("setItemIndiLast", item)
                commit("setIndiItems", items)
            })
        },
        getSearchIndiItems({ commit, state }, query) {
            var itemColl;
            if (!query.more) {
                state.searchIndiItems = []
                state.searchIndiLast = null;
                itemColl = indipendentItemCollection.orderBy('name').where('searchArray', 'array-contains', query.value).limit(25)
            } else {
                itemColl = indipendentItemCollection.orderBy('name').where('searchArray', 'array-contains', query.value).startAfter(state.searchIndiLast).limit(25)
            }
            itemColl.get().then(querySnapshot => {
                var items = [];
                querySnapshot.forEach(doc => {
                    items.push({
                        id: doc.id,
                        ...doc.data(),
                    })
                })
                var item = querySnapshot.docs[querySnapshot.docs.length - 1]
                commit("setsearchIndiLast", item)
                commit("setSearchIndiItems", items)
            })
        },
    },



}