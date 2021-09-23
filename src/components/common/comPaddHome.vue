<template>
  <div class="px-1 px-md-2 pt-2 pt-md-3 pb-2 h-100">
    <transition appear="slide-fade">
      <slot> </slot>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transitionName: "slide-fade",
    };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "slide-fade" : "slide-fade";
    },
  },
};
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>