<template>
  <router-view> </router-view>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("getSettingsAdminDetails");
    this.$store.dispatch("setRouteName", "Settings");
  },
};
</script>

<style lang="scss" scoped>
</style>