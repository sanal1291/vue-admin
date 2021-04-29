import { db } from '../../firebase'

export default {
    state: {
        adminDetails: null,
        loadingAdmin: true,
    },

    //  mutations
    mutations: {
        setadminDetails(state, items) {
            state.adminDetails = items
        }
    },

    // actions 
    actions: {
        getSettingsAdminDetails({ commit, state }) {
            state.loadingAdmin = true;
            if (!state.adminDetails) {
                db.collection('adminDetials').onSnapshot(snapshot => {
                    let adminDetails;
                    adminDetails = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
                    commit("setadminDetails", adminDetails)
                    state.loadingAdmin = false;
                })
            } else {
                state.loadingAdmin = false;
            }
        }
    },
}