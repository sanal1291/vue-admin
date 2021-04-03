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
        getCarousels({ commit, state }) {
            if (state.carousels.length === 0) {
                carouselCollection.onSnapshot((snapshot) => {
                    let carousels = []
                    snapshot.forEach((doc) => {
                        carousels.push({
                            id: doc.id, ...doc.data()
                        })
                    })
                    console.log(carousels)
                    commit("setCarousels", carousels)
                })
            }
        }
    },



}