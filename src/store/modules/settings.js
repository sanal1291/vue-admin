import Vue from 'vue';
import { db } from '../../firebase'

export default {
    state: {
        adminDetails: null,
        loadingAdmin: true,
        areaLoading: true,
        areas: [],
        locations: {},
        areaImages: {},
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
        setareas(state, items) {
            state.areas = items;
        },
        setareaLoading(state, value) {
            state.areaLoading = value;
        },
        setlocations(state, query) {
            // Vue.set(state.areaImages, query.area, query.imageURL)
            Vue.set(state.locations, query.area, query.locations)
        },
        setlocationsLoading(state, value) {
            state.locationsLoading = value;
        },
    },

    // actions 
    actions: {
        getSettingsAdminDetails({ commit, state, rootState }) {
            commit("setloadingAdmin", true)
            if (!state.adminDetails) {
                rootState.snapshots.push(db.collection('adminDetials').doc('yN7N5geufqe2XmoKnyYyHPrajaR2').onSnapshot(doc => {
                    let adminDetails;
                    adminDetails = { id: doc.id, ...doc.data() }
                    commit("setadminDetails", adminDetails)
                    commit("setloadingAdmin", false)

                }))
            } else {
                commit("setloadingAdmin", false)
            }
        },

        getSettingsAreas({ commit, state, rootState }) {
            if (state.areas.length == 0) {
                commit("setareaLoading", true)
                rootState.snapshots.push(db.collection('Areas').onSnapshot(snapshot => {
                    let areas = []
                    snapshot.docs.forEach(doc => {
                        areas.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    })
                    commit("setareaLoading", false)
                    commit("setareas", areas)
                }))
            }
        },

        getSettingsLocations({ commit, state }, query) {
            if (query.forced || !state.locations[query.id]) {
                commit("setlocationsLoading", true)
                db.collection("locations").where("areaId", "==", query.id).get().then(querySnapshot => {
                    var locations = [];
                    // var imageURL = null;
                    querySnapshot.forEach((doc) => {
                        // imageURL = imageURL ? imageURL : doc.get('url');
                        locations.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    })
                    commit("setlocations", { area: query.id, locations: locations })
                    commit("setlocationsLoading", false)

                })
            }
        }
        // /////////////// batch update
        //     console.log(query)
        //     var batch = db.batch()
        //     var docref;
        //     db.collection('locations').where("area", "==", query.name).get().then(querysnapshot => {
        //         querysnapshot.forEach((doc) => {
        //             docref = db.collection('locations').doc(doc.id)
        //             batch.set(docref, { areaId: doc.get('areaId'), locality: doc.get('locality'), minAmount: doc.get('minAmount') })
        //         })
        //         batch.commit().then(() => {
        //             console.log('sucess')
        //         })
        //     })
        //     // var docref = db.collection('locations').doc('123')
        //     // batch.update(docref, { areaId: query.id })
        //     // batch.commit().then(() => {
        //     //     console.log('sucess')
        //     // })
        // }
    },
}