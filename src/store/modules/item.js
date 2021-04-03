import { ItemCollection } from "../../firebase";

export default {
    state: {
        itemGroups: [],
        lastItemGroup: null,
    },


    //  mutations
    mutations: {
        setItemGroups(state, items) {
            state.itemGroups = [...state.itemGroups, ...items];
        },
        setLastItemGroup(state, item) {
            state.lastItemGroup = item;
        }
    },

    // actions 
    actions: {
        getItemsGroups({ commit, state }, reload) {
            if (reload) {
                state.itemGroups = []
            }
            var itemColl;
            if (state.itemGroups.length === 0) {
                itemColl = ItemCollection.orderBy('name').limit(15);
            } else {
                itemColl = ItemCollection.orderBy('name').startAfter(state.lastItemGroup).limit(15)
            }
            itemColl.get().then((querySnapshot) => {
                var items = [];
                querySnapshot.forEach((doc) => {
                    items.push({
                        id: doc.id,
                        displayName: doc.get('displayName'),
                        imageUrl: doc.get('imageUrl'),
                        varieties: doc.get('varieties'),
                        category: doc.get('category')
                    })
                })
                var item = querySnapshot.docs[querySnapshot.docs.length - 1]
                commit("setLastItemGroup", item)
                commit("setItemGroups", items)
            })
        },
    }
}