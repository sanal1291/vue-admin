<template>
  <router-view></router-view>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("setRouteName", "Orders");
  },
};
</script>

<style lang="scss" scoped>
</style>