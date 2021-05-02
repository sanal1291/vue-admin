<template>
  <div>
    <b-card>
      <div>Delivery stats</div>
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
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { functions } from "../../firebase";
export default {
  props: ["order"],
  computed: {
    ...mapState({ orders: (state) => state.orders.ordersList }),
  },
  data() {
    return {
      options: [
        { value: "on-hold", text: "On-hold" },
        { value: "processing", text: "Processing" },
        { value: "canceled", text: "Canceled" },
        { value: "delivered", text: "Delivered" },
      ],
      statusValue: null,
      changed: false,
      submitting: false,
    };
  },
  mounted() {
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
        orderId: this.order.orderId,
      });
      if (result.error) {
        this.$root.$bvToast.toast(result.data, {
          title: "Order",
          autoHideDelay: 5000,
        });
      } else {
        this.$root.$bvToast.toast("Sucess", {
          title: "Order",
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
</style>