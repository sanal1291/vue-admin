<template>
  <div></div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      windowWidth: document.body.clientWidth,
    };
  },
  computed: {
    ...mapState({ isMobile: (state) => state.sidebar.isMobile }),
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.$store.dispatch("setWidth", this.windowWidth);
    if (this.windowWidth < 768) {
      this.$store.dispatch("setIsMobile", true);
    }
  },
  methods: {
    onResize() {
      this.windowWidth = document.body.clientWidth;
    },
  },
  watch: {
    windowWidth: function () {
      this.$store.dispatch("setWidth", this.windowWidth);
      if (this.windowWidth < 768 && !this.isMobile) {
        this.$store.dispatch("setIsMobile", true);
      } else if (this.windowWidth >= 768 && this.isMobile) {
        this.$store.dispatch("setIsMobile", false);
      }
    },
  },
  unmounted() {
    window.removeEventListener("resize");
  },
};
</script>

<style lang="scss" scoped>
</style>