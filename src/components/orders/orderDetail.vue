<template>
  <b-card no-body class="p-2" id="order-content">
    <b-container fluid class="p-0">
      <b-row no-gutters>
        <b-col cols="12">
          <b-card no-body class="p-1">
            <b-row no-gutters>
              <b-col cols="12" sm="6" md="4" class="px-1">
                <usercard :userId="order.userId" />
              </b-col>
              <b-col cols="12" sm="6" md="4" class="px-1">
                <div>
                  <h6>Delivery Address</h6>
                  <ul>
                    <li>Name : {{ order.shipping.first_name }}</li>
                    <li>
                      <div>address :</div>
                      <div class="pl-2">
                        <div>{{ order.shipping.address_1 }}</div>
                        <div>{{ order.shipping.address_2 }}</div>
                        <div>
                          {{ order.shipping.locality }},
                          {{ order.shipping.area }}
                        </div>
                      </div>
                    </li>
                    <li>Phone no : {{ order.shipping.phNumber }}</li>
                  </ul>
                </div>
              </b-col>
              <b-col cols="12" sm="6" md="4" class="px-1">
                <h6>status</h6>
                <ul>
                  <li>Total Cost: {{ order.totalCost }}</li>
                  <li>
                    Status :
                    <span
                      :class="{
                        'text-sucess': order.livestatus == 'delivered',
                        'text-primary':
                          order.livestatus == 'on-hold' || 'processing',
                        'text-danger': order.livestatus == 'canceled',
                      }"
                      >{{ order.livestatus }}</span
                    >
                  </li>
                  <li>
                    Razor pay id:
                    <b-link
                      :href="razorpayURL + order.razorpayOrderId"
                      target="_blank"
                    >
                      {{ order.razorpayOrderId }}</b-link
                    >
                  </li>
                  <li>
                    <div>Change status</div>
                    <b-form-select
                      @change="statsChanged"
                      v-model="statusValue"
                      :options="options"
                    ></b-form-select>
                    <b-overlay
                      :show="submitting"
                      rounded
                      opacity="0.6"
                      spinner-small
                      spinner-variant="primary"
                      class="d-inline-block float-right m-2"
                    >
                      <b-button
                        @click="submitStatus"
                        v-if="changed"
                        :disabled="submitting"
                        variant="success"
                        type="submit"
                      >
                        Submit
                      </b-button>
                    </b-overlay>
                  </li>
                </ul>
              </b-col>
            </b-row></b-card
          >
        </b-col>
        <b-col cols="12" lg="5" class="py-1 pr-1">
          <b-card no-body>
            <b-card-header class="p-2">
              <span class="h6"> Items</span>
              <span class="float-right">total: {{ itemsTotalCost }}</span>
            </b-card-header>
            <b-table
              :hover="false"
              small
              :fields="itemsFields"
              :items="order.items"
            >
              <template #cell(index)="data">
                {{ data.index + 1 }}
              </template>
              <template #cell(itemName)="{ value }">
                {{ value["en"] }}
              </template>
            </b-table>
          </b-card>
        </b-col>
        <b-col cols="12" lg="7" class="p-1">
          <b-card no-body>
            <b-card-header class="p-2">
              <span class="h6"> Packages</span>
              <span class="float-right">total: {{ packagesTotalCost }}</span>
            </b-card-header>
            <b-table
              :hover="false"
              small
              :fields="packagesFields"
              :items="order.packages"
            >
              <template #cell(index)="data">
                {{ data.index + 1 }}
              </template>
              <template #cell(itemName)="{ value }">
                {{ value["en"] }}
              </template>
              <template #cell(items)="data">
                <ul>
                  <li v-for="(item, index) in data.item.items" :key="index">
                    {{ item.itemName["en"] + " : " + item.quantity + ":" }}Nos
                    ,total={{ item.total }}
                  </li>
                </ul>
              </template>
            </b-table>
          </b-card></b-col
        >
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import { mapState } from "vuex";
import { functions } from "../../firebase";
import usercard from "./usercard.vue";
export default {
  components: { usercard },
  props: ["order"],
  computed: {
    ...mapState({ orders: (state) => state.orders.ordersList }),
  },
  data() {
    return {
      // item data
      itemsTotalCost: 0,
      itemsFields: [
        "index",
        { key: "itemName", label: "Name" },
        "quantity",
        "total",
      ],
      // end item data
      // packages data
      packagesTotalCost: 0,
      packagesFields: [
        "index",
        { key: "itemName", label: "Package Name" },
        "items",
        { key: "quantity", label: "Quantity" },
        { key: "total", label: "Total" },
      ],
      // end packages data
      options: [
        { value: "on-hold", text: "On-hold" },
        { value: "processing", text: "Processing" },
        { value: "canceled", text: "Canceled" },
        { value: "delivered", text: "Delivered" },
      ],
      statusValue: null,
      changed: false,
      submitting: false,
      razorpayURL: "https://dashboard.razorpay.com/app/orders/",
    };
  },
  mounted() {
    this.order.items.forEach((item) => {
      this.itemsTotalCost += item.total;
    });
    this.order.packages.forEach((item) => {
      this.packagesTotalCost += item.price;
    });
    // this.packages.forEach((item) => item.push(this.order.items));
    this.init();
  },
  methods: {
    init() {
      this.statusValue = this.order.livestatus;
      this.changed = false;
    },
    statsChanged() {
      if (this.statusValue != this.order.livestatus) {
        this.changed = true;
      } else {
        this.changed = false;
      }
    },
    async submitStatus() {
      this.submitting = true;
      var statusFun = functions.httpsCallable("notifications-orderStatus");
      var result = await statusFun({
        status: this.statusValue,
        orderId: this.order.id,
      });
      if (result.error) {
        this.$root.$bvToast.toast(result.data, {
          title: "Order ",
          autoHideDelay: 5000,
        });
      } else {
        this.$root.$bvToast.toast("Sucess", {
          title: "Order" + this.order.id,
          autoHideDelay: 5000,
        });
      }
      this.submitting = false;
    },
  },
  watch: {
    order() {
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
#order-content {
  background-color: #e1e8eb;
}
</style>