<template>
  <com-padd-home>
    <router-view></router-view>
  </com-padd-home>
</template>

<script>
import comPaddHome from "../components/common/comPaddHome.vue";
export default {
  components: { comPaddHome },
  mounted() {
    this.$store.dispatch("getUsers");
    this.$store.dispatch("setRouteName", "Orders");
  },
};
</script>

<style lang="scss" scoped>
</style>