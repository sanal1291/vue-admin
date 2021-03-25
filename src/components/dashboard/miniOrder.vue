<template>
  <div class="p-2">
    <b-card class="p-1" no-body style="width: 300px">
      <div>Orders for today:</div>
      <div v-if="loading" class="text-center text-danger my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>
      <div class="d-flex justify-content-between" v-else>
        <h5>{{ ordersList.length }}</h5>
        <b-link :to="{ name: 'orderHome', params: { today: this.today } }"
          >Goto orders <b-icon icon="arrow-right"></b-icon
        ></b-link>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      today: null,
    };
  },
  computed: {
    ...mapState({ ordersList: (state) => state.orders.ordersList }),
    ...mapState({ loading: (state) => state.orders.loading }),
  },
  mounted() {
    const now = new Date();
    this.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    this.$store.dispatch("getOrders", {
      fromDate: this.today,
      toDate: date,
    });
  },
};
</script>

<style lang="scss" scoped>
</style>