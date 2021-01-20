import { auth } from "../../firebase";
import router from "../../router";

export default {
    state: {
        user: '',
    },
    getters: {
    },
    mutations: {
        setUser(state, val) {
            state.user = val;
        }
    },
    actions: {
        async login({ dispatch }, form) {
            await auth.signInWithEmailAndPassword(form.email, form.password)
            dispatch('fetchUser')
            router.push("/dashboard")
        },
        fetchUser({ commit }) {
            const user = auth.currentUser.email;
            commit('setUser', user);
        },
        async logout() {
            await auth.signOut()
            router.push('/')
        }
    },
}