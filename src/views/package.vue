<template>
  <com-padd-home>
    <router-view></router-view>
  </com-padd-home>
</template>

<script>
import comPaddHome from "../components/common/comPaddHome.vue";
export default {
  components: { comPaddHome },
  beforeCreate: function () {
    if (this.$store.state.packages.length == 0) {
      this.$store.dispatch("setPackages");
    }
  },
  mounted() {
    this.$store.dispatch("setRouteName", "Packages");
  },
};
</script>