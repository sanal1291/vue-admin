<template>
  <div class="home">
    <mini-order />
  </div>
</template>

<script>
// @ is an alias to /src
import miniOrder from "../components/dashboard/miniOrder.vue";
export default {
  components: { miniOrder },
  name: "Dashboard",
};
</script>
