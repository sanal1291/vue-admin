import { orders } from "../../firebase";

export default {
    state: {
        ordersList: null,
        loading: false,
    },

    //  mutations
    mutations: {
        setOrders(state, arr) {
            state.ordersList = arr
        }
    },

    // actions 
    actions: {
        async getOrders({ commit, state }, query) {
            state.loading = true;
            state.orders = [];
            orders.where('dateTime', '>=', query.fromDate).where('dateTime', '<', query.toDate).orderBy('dateTime')
                .get().then(querySnapshot => {
                    var arr = [];
                    querySnapshot.forEach(item => {
                        for (let index = 0; index < 100; index++) {
                            arr.push({
                                id: index,
                                dateTime: item.get('dateTime'),
                                orderId: item.get('orderId'),
                                orderKey: item.get('orderKey'),
                                status: item.get('status'),
                                total: item.get('totalCost')
                            })
                        }
                    })
                    commit("setOrders", arr)
                })
            state.loading = false;

        },
    },



}