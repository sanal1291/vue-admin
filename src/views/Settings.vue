<template>
  <div>
    <router-view> </router-view>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("getSettingsAdminDetails");
  },
};
</script>

<style lang="scss" scoped>
</style>