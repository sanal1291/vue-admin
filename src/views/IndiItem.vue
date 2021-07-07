<template>
  <com-padd-home>
    <indi-item-home />
  </com-padd-home>
</template>

<script>
import ComPaddHome from "../components/common/comPaddHome.vue";
import IndiItemHome from "../components/IndiItemHome";
export default {
  components: { IndiItemHome, ComPaddHome },
  mounted() {
    this.$store.dispatch("setRouteName", "Individual items");
  },
};
</script>

<style lang="scss" scoped>
</style>