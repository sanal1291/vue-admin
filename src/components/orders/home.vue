<template>
  <div class="d-flex flex-column">
    <div class="d-flex justify-content-between flex-grow-0">
      <h3>Orders</h3>
      <b-button>Create</b-button>
    </div>
    <b-form @submit.prevent="submit" class="pt-2">
      <div class="d-flex align-items-center">
        <div class="px-2">From:</div>
        <b-form-datepicker
          :max="today"
          value-as-date
          v-model="fromDate"
          class="datepicker"
          :state="reqFrom"
          placeholder="From date"
          locale="en-GB"
          dark
          :date-format-options="{
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }"
        ></b-form-datepicker>
        <div class="px-2">TO:</div>
        <b-form-datepicker
          :max="maxDate"
          :min="minDate"
          :disabled="fromDate == null"
          value-as-date
          v-model="toDate"
          class="datepicker mr-2"
          :state="reqTo"
          placeholder="To date"
          locale="en-GB"
          dark
          :date-format-options="{
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }"
        ></b-form-datepicker>
        <b-button
          :disabled="fromDate == null || toDate == null || !queryChange"
          type="submit"
          >go</b-button
        >
      </div>
    </b-form>
    <div class="flex-grow-1 p-1">
      <b-row no-gutters>
        <b-col cols="12" md="8">
          <b-table
            show-empty
            empty-text="No orders in given time period or id"
            empty-filtered-text="No orders in given time period or id"
            @row-selected="rowSelected"
            selectable
            select-mode="single"
            sticky-header="500px"
            hover
            :fields="fields"
            :busy="loading"
            samll
            id="order-table-main"
            :items="orders"
            :per-page="perPage"
            :current-page="currentPage"
          >
            <template #table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>
          </b-table>
          <b-pagination
            v-model="currentPage"
            align="center"
            pills
            :per-page="perPage"
            :total-rows="totalRows"
            aria-controls="order-table-main"
          ></b-pagination
        ></b-col>
        <b-col cols="12" md="4" class="px-2">
          <order-detail v-if="selectedOrder" :order="selectedOrder" />
          <b-card v-else>Select an order.</b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import orderDetail from "./orderDetail.vue";
export default {
  components: { orderDetail },
  computed: {
    ...mapState({ orders: (state) => state.orders.ordersList }),
    ...mapState({ loading: (state) => state.orders.loading }),
    totalRows() {
      return this.orders ? this.orders.length : 0;
    },
  },
  data() {
    return {
      reqFrom: true,
      reqTo: true,
      fromDate: null,
      toDate: null,
      maxDate: null,
      minDate: null,
      queryChange: false,
      today: null,
      // table data
      currentPage: 1,
      perPage: 15,
      fields: [
        "id",
        { key: "dateTimeF", label: "Time" },
        { key: "orderKey", label: "Key" },
        { key: "livestatus", label: "status" },
        "total",
      ],
      selectedOrder: null,
    };
  },
  mounted() {
    const now = new Date();
    this.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (this.$route.params.today) {
      this.fromDate = this.$route.params.today;
      this.toDate = this.$route.params.today;
      this.submit();
    }
  },
  methods: {
    rowSelected(order) {
      this.selectedOrder = order[0];
    },
    submit() {
      this.queryChange = false;
      const date = new Date(this.toDate);
      date.setDate(date.getDate() + 1);
      this.$store.dispatch("getOrders", {
        fromDate: this.fromDate,
        toDate: date,
      });
    },
  },
  watch: {
    fromDate() {
      this.toDate = this.fromDate;
      this.minDate = new Date(this.fromDate);
      // 15th in two months
      this.maxDate = new Date(this.fromDate);
      this.maxDate.setMonth(this.maxDate.getMonth() + 1);
      if (this.maxDate > this.today) {
        this.maxDate = this.today;
      }
      this.queryChange = true;
    },
    toDate() {
      this.queryChange = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.datepicker {
  width: 175px;
}
</style>