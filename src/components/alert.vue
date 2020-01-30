<template>
  <div v-if="getalert.isshow" :class="getalert.status">{{getalert.alertMsg}}</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getalert"])
  }
};
</script>

<style scoped lang="postcss">
.alert-gray {
  @apply fixed font-bold inline-block px-6 py-4 border border-gray-500 rounded bg-gray-300;
  top: 2rem;
  right: 3rem;
}
.alert-blue {
  @apply fixed font-bold inline-block px-6 py-4 border border-blue-500 rounded bg-blue-300;
  top: 2rem;
  right: 3rem;
}
.alert-danger {
  @apply fixed font-bold inline-block px-6 py-4 border border-red-500 rounded bg-red-300;
  top: 2rem;
  right: 3rem;
}
.alert-safe {
  @apply fixed font-bold inline-block px-6 py-4 border border-green-500 rounded bg-green-300;
  top: 2rem;
  right: 3rem;
}
</style>