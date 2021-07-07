<template>
  <com-padd-home>
    <router-view></router-view>
  </com-padd-home>
</template>

<script>
import ComPaddHome from "../components/common/comPaddHome.vue";
export default {
  components: { ComPaddHome },
  mounted() {
    this.$store.dispatch("setRouteName", "Item groups");
  },
};
</script>

<style lang="scss" scoped>
</style>