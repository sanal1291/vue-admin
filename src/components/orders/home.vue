<template>
  <b-card class="h-100" no-body>
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <h5>Orders</h5>
        <!-- <b-button :to="{ name: 'orderAdd', query: { edit: false } }"
          >Create</b-button
        > -->
      </div>
    </template>
    <template #default>
      <div class="d-flex flex-column p-2">
        <b-form @submit.prevent="submit">
          <b-container class="p-0">
            <b-row no-gutters>
              <b-col cols="auto">
                <div class="d-flex justify-content-between">
                  <span class="pr-1"> From:</span>
                  <b-form-datepicker
                    size="sm"
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
                </div>
                <div class="d-flex justify-content-between py-1">
                  <span class="pr-1"> To:</span>
                  <b-form-datepicker
                    size="sm"
                    :max="maxDate"
                    :min="minDate"
                    :disabled="fromDate == null"
                    value-as-date
                    v-model="toDate"
                    class="datepicker"
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
                </div>
                <b-button
                  class="float-right"
                  size="sm"
                  :disabled="fromDate == null || toDate == null || !queryChange"
                  type="submit"
                  >go</b-button
                >
              </b-col>
            </b-row>
          </b-container>
        </b-form>
        <div class="flex-grow-1 p-1">
          <b-table
            small
            show-empty
            empty-text="No orders in given time period or id"
            empty-filtered-text="No orders in given time period or id"
            select-mode="single"
            sticky-header="500px"
            hover
            :fields="fields"
            :busy="loading"
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
            <template #row-details="row">
              <b-card no-body>
                <order-detail :order="row.item" />
                <b-container></b-container>
              </b-card>
            </template>
            <template #cell(actions)="row">
              <b-button size="sm" @click="row.toggleDetails">
                <b-icon
                  v-if="row.detailsShowing"
                  icon="chevron-bar-up"
                ></b-icon>
                <b-icon v-else icon="chevron-bar-down"></b-icon>
              </b-button>
            </template>
          </b-table>
          <b-pagination
            v-model="currentPage"
            align="center"
            pills
            :per-page="perPage"
            :total-rows="totalRows"
            aria-controls="order-table-main"
          ></b-pagination>
        </div>
      </div>
    </template>
  </b-card>
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
        // { key: "orderKey", label: "Key" },
        { key: "livestatus", label: "status" },
        { key: "totalCost", label: "Total" },
        "actions",
      ],
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