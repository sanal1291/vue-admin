import { orders } from "../../firebase";

export default {
    state: {
        ordersList: [],
        loading: false,
    },

    //  mutations
    mutations: {
        setOrders(state, arr) {
            state.ordersList = arr
        },
    },

    // actions 
    actions: {
        async getOrders({ commit, state }, query) {
            state.loading = true;
            state.orders = [];
            orders.where('dateTime', '>=', query.fromDate).where('dateTime', '<', query.toDate).orderBy('dateTime')
                .onSnapshot(querySnapshot => {
                    var arr = [];
                    querySnapshot.forEach(item => {
                        var time = new Date(item.get('dateTime').seconds * 1000);
                        arr.push({
                            ...{
                                id: item.id,
                                dateTimeF: `${("0" + time.getHours()).slice(-2)}:${("0" + time.getMinutes()).slice(-2)} 
                                        /${("0" + time.getDate()).slice(-2)}-${("0" + (time.getMonth() + 1)).slice(-2)}-${time.getFullYear()}`,
                            }, ...item.data()
                        })

                    })
                    commit("setOrders", arr)
                    state.loading = false;

                })

        },
    },



}