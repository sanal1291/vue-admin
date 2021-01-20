export default {
    state: {
        sidebar: false,
    },

    //  getters
    getters: {
        getSidebar(state) {
            return state.sidebar;
        }
    },

    //  mutations
    mutations: {
        sidebar(state) {
            state.sidebar = !state.sidebar;
        }
    },

    // actions 
    actions: {
        toggleSidebar(context) {
            context.commit('sidebar')
        }
    },



}