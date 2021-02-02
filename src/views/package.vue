<template>
  <router-view></router-view>
</template>

<script>
export default {
  beforeCreate: function () {
    if (this.$store.state.packages.length == 0) {
      this.$store.dispatch("setPackages");
    }
  },
};
</script>

<style lang="scss" scoped>
</style>