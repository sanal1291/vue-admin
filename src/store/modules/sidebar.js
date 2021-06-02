export default {
    state: {
        sidebar: false,
        isMobile: false,
        width: null,
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
        },
        setIsMobile(state, bool) {
            state.isMobile = bool;
        },
        setWidth(state, val) {
            state.width = val;
        },
    },

    // actions 
    actions: {
        toggleSidebar(context) {
            context.commit('sidebar')
        },
        setIsMobile({ commit }, bool) {
            commit("setIsMobile", bool)
        },
        setWidth({ commit }, val) {
            commit("setWidth", val)
        },
    },



}