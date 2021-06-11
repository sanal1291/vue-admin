import { userCollection } from "../../firebase";


export default {
    state: {
        searchUsers: [],
        users: [],
        searchUserLast: null,
        userLast: null,
        usersLoading: false,
    },
    //  mutations
    mutations: {
        setsearchUser(state, value) {
            console.log(value)
            // state.searchUsers = [...state.searchUsers, ...value];
            state.searchUsers = value
        },
        setsearchUserLast(state, value) {
            state.searchUserLast = value;
        },
        setusers(state, value) {
            state.users = [...state.users, ...value];
        },
        setuserLast(state, value) {
            state.userLast = value;
        },
        setusersLoading(state, value) {
            state.usersLoading = value;
        }
    },

    actions: {
        getUsers({ commit, state }) {
            commit('setusersLoading', true);
            var itemColl;
            if (state.users && state.users.length === 0) {
                state.userLast = null
                itemColl = userCollection.orderBy('fullname').limit(2)
            } else {
                if (state.userLast) {
                    itemColl = userCollection.orderBy('fullname').startAfter(state.userLast).limit(2)
                }
                else {
                    commit('setusersLoading', false);
                    return
                }
            }
            itemColl.get().then((querySnapshot) => {
                var items = [];
                querySnapshot.forEach(doc => {
                    items.push({
                        id: doc.id, ...doc.data()
                    })
                })
                var item = querySnapshot.docs[querySnapshot.docs.length - 1]
                commit("setusers", items)
                commit("setuserLast", item)
                commit('setusersLoading', false);

            })
        },
        getSearchUsers({ commit, state }, query) {
            commit('setusersLoading', true);
            var itemColl;
            if (!query.single) {
                if (!query.more) {
                    state.searchUsers = []
                    state.searchUserLast = null;
                    itemColl = userCollection.orderBy('fullname').where('searchArray', 'array-contains', query.value).limit(25)
                } else if (query.more) {
                    itemColl = userCollection.orderBy('fullname').where('searchArray', 'array-contains', query.value).startAfter(state.searchUserLast).limit(25)
                }
                itemColl.get().then(querySnapshot => {
                    var items = [];
                    querySnapshot.forEach(doc => {
                        items.push({
                            id: doc.id, ...doc.data()
                        })
                    })
                    var item = querySnapshot.docs[querySnapshot.docs.length - 1]
                    commit("setsearchUser", items)
                    commit("setsearchUserLast", item)
                    commit('setusersLoading', false);

                })
            } else {
                userCollection.doc(query.value).get().then(doc => {
                    var items = []
                    if (doc.exists) {
                        console.log(doc.data())
                        items.push({
                            id: doc.id, ...doc.data()
                        })
                        var item = null
                        commit("setsearchUser", items)
                        commit("setsearchUserLast", item)
                    } else {
                        commit("setsearchUser", [])
                        commit("setsearchUserLast", null)

                    }
                    commit('setusersLoading', false);
                })
            }
        },
    },



}