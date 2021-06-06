<template>
  <indi-item-home />
</template>

<script>
import IndiItemHome from "../components/IndiItemHome";
export default {
  components: { IndiItemHome },
  mounted() {
    this.$store.dispatch("setRouteName", "Individual items");
  },
};
</script>

<style lang="scss" scoped>
</style>