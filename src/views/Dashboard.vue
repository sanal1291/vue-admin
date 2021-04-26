<template>
  <div class="home">
    <mini-order />
    <!-- <button @click="testing">hi</button> -->
  </div>
</template>

<script>
// @ is an alias to /src
import miniOrder from "../components/dashboard/miniOrder.vue";
import { functions } from "../firebase";
export default {
  components: { miniOrder },
  name: "Dashboard",
  // methods: {
  //   testing() {
  //     var testfun = functions.httpsCallable("freshgorder-razorpayOrder");
  //     testfun({ amount: 500, receiptId: "hello" })
  //       .then((res) => {
  //         console.log(res);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   },
  // },
};
</script>
