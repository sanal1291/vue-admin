<template>
  <com-padd-home>
    <router-view> </router-view>
  </com-padd-home>
</template>

<script>
import comPaddHome from "../components/common/comPaddHome.vue";

export default {
  components: { comPaddHome },
  mounted() {
    this.$store.dispatch("getSettingsAdminDetails");
    this.$store.dispatch("setRouteName", "Settings");
  },
};
</script>

<style lang="scss" scoped>
</style>