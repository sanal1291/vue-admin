import { carouselCollection } from "../../firebase";

export default {
    state: {
        carousels: [],
    },


    //  mutations
    mutations: {
        setCarousels(state, items) {
            state.carousels = items;
        }
    },

    // actions 
    actions: {
        getCarousels({ commit, state, rootState }) {
            if (state.carousels.length === 0) {
                rootState.snapshots.push(carouselCollection.onSnapshot((snapshot) => {
                    let carousels = []
                    snapshot.forEach((doc) => {
                        carousels.push({
                            id: doc.id, ...doc.data()
                        })
                    })
                    commit("setCarousels", carousels)
                }))
            }
        }
    },



}