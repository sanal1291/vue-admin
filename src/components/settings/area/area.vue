<template>
  <com-padd-home>
    <router-view></router-view>
  </com-padd-home>
</template>

<script>
import comPaddHome from "../../common/comPaddHome.vue";
export default {
  components: { comPaddHome },
  mounted() {
    this.$store.dispatch("getSettingsAreas");
  },
};
</script>

<style lang="scss" scoped>
</style>