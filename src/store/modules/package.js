import { packageCollection } from '../../firebase'
export default {
    state: {
        packages: [],
    },

    //  getters
    getters: {
    },

    //  mutations
    mutations: {
        setPackages(state) {
            packageCollection.onSnapshot((snapshot) => {
                let packages = []
                snapshot.forEach((doc) => {
                    packages.push({ id: doc.id, name: doc.get('name') })
                })
                state.packages = packages;
            })
        }
    },

    // actions 
    actions: {
        setPackages({ commit }) {
            commit("setPackages")
        }
    },



}