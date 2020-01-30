<template>
  <div
    class="h-screen bg-logo bg-center bg-no-repeat"
    :style="rightImage | backgroungImage"
  ></div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["rightImage","selecteduserId"])
  },
  filters: {
    backgroungImage(val) {
      return `background-image:url('${val}')`;
    }
  }
};
</script>

<style scoped lang="postcss">
</style>