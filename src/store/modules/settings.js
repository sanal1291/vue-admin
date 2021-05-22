import Vue from 'vue';
import { db } from '../../firebase'

export default {
    state: {
        adminDetails: null,
        loadingAdmin: true,
        locations: {},
        locationsLoading: true,
    },

    //  mutations
    mutations: {
        setadminDetails(state, items) {
            state.adminDetails = items
        },
        setloadingAdmin(state, value) {
            state.loadingAdmin = value;
        },
        setlocations(state, query) {
            Vue.set(state.locations, query.area, query.locations)
            // state.locations = query.locations
        },
        setlocationsLoading(state, value) {
            state.locationsLoading = value;
        },
    },

    // actions 
    actions: {
        getSettingsAdminDetails({ commit, state }) {
            commit("setloadingAdmin", true)
            if (!state.adminDetails) {
                db.collection('adminDetials').onSnapshot(snapshot => {
                    let adminDetails;
                    adminDetails = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
                    commit("setadminDetails", adminDetails)
                    commit("setloadingAdmin", false)

                })
            } else {
                commit("setloadingAdmin", false)
            }
        },

        getSettingsLocations({ commit, state }, query) {
            if (query.forced || !state.locations[query.area]) {
                commit("setlocationsLoading", true)
                db.collection("locations").orderBy("locality").where("area", "==", query.area).get().then(querySnapshot => {
                    var locations = [];
                    var index = 1
                    querySnapshot.forEach((doc) => {
                        locations.push({
                            id: doc.id,
                            index: index++,
                            ...doc.data()
                        })
                    })
                    commit("setlocations", { area: query.area, locations: locations })
                    commit("setlocationsLoading", false)

                })
            }
        }
    },
}