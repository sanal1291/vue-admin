<template>
  <router-view></router-view>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("getSettingsAreas");
  },
};
</script>

<style lang="scss" scoped>
</style>