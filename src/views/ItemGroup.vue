<template>
  <router-view></router-view>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("setRouteName", "Item groups");
  },
};
</script>

<style lang="scss" scoped>
</style>