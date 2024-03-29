import { auth, adminCollection } from "../../firebase";
import router from "../../router";

export default {
    state: {
        isAdmin: false,
        user: '',
        busy: false,
        error: '',
        redirect: null,
    },
    getters: {
    },
    mutations: {
        setUser(state, val) {
            state.user = val;
        },
        setBusy(state, val) {
            state.busy = val;
        },
        setisAdmin(state) {
            state.isAdmin = true;
        },
        setError(state, val) {
            state.error = val;
        },
        setRedirect(state, val) {
            state.redirect = val;
        }
    },
    actions: {
        login({ dispatch, commit }, form) {
            commit('setError', '')
            commit('setBusy', true)
            auth.signInWithEmailAndPassword(form.email, form.password).then(user => {
                commit('setRedirect', form.redirect)
            }, (error) => {
                commit('setBusy', false)
                commit('setError', "Email or password incorrect")
            })
        },
        checkAdmin({ dispatch, commit, state }, uid) {
            adminCollection.doc(uid).get().then(() => {
                commit('setBusy', false)
                commit('setisAdmin')
                const user = auth.currentUser.email;
                commit('setUser', user);
                if (router.currentRoute.path == '/') {
                    router.push('/dashboard')
                }
            }, (error) => {
                commit('setBusy', false)
                commit('setError', "You need Admin previlages to login")
                dispatch('logout', true)
            })
        },
        async logout(context) {
            context.rootState.snapshots.forEach(element => {
                element()
            });
            await auth.signOut()
            if (router.currentRoute.path != '/') {
                router.push('/')
            }
        }
    },
}