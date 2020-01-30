<template>
  <div id="app">
    <div class="mx-auto">
      <div class="flex flex-wrap">
        <div
          v-if="!screenisphone || selecteduserId === -1"
          class="flex flex-col justify-between w-full h-screen bg-gray-leftboard sm:w-1/3"
        >
          <leftconswitch></leftconswitch>
          <div :is="activenavlist"></div>
          <leftsearch></leftsearch>
        </div>
        <!-- sm: 640 px 這裡考慮用 vue 去控制 -->
        <transition name="board">
          <div
            v-if="!screenisphone || selecteduserId !== -1"
            class="flex flex-col justify-between w-full sm:w-2/3 bg-gray-rightboard"
          >
            <rightimage v-if="selecteduserId === -1"></rightimage>
            <rightnavbar v-if="selecteduserId !== -1"></rightnavbar>
            <rightboard v-if="selecteduserId !== -1"></rightboard>
            <rightinput v-if="selecteduserId !== -1"></rightinput>
          </div>
        </transition>
      </div>
    </div>
    <previewmodal></previewmodal>
    <alert></alert>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import leftconswitch from "@/components/leftconswitch.vue";
import leftlistcontact from "@/components/leftlistcontact.vue";
import leftlistrecent from "@/components/leftlistrecent.vue";
import leftsearch from "@/components/leftsearch.vue";
import rightimage from "@/components/rightimage.vue";
import rightnavbar from "@/components/rightnavbar.vue";
import rightboard from "@/components/rightboard.vue";
import rightinput from "@/components/rightinput.vue";
import previewmodal from "@/components/previewmodal.vue";
import alert from "@/components/alert.vue";
export default {
  name: "app",
  components: {
    leftconswitch,
    leftlistcontact,
    leftlistrecent,
    leftsearch,
    rightimage,
    rightnavbar,
    rightboard,
    rightinput,
    previewmodal,
    alert,
  },
  computed: {
    ...mapGetters(["screenisphone", "activenavlist", "selecteduserId"])
  },
  mounted() {
    const vm = this;
    vm.$nextTick(() => {
      window.addEventListener("resize", e => {
        vm.$store.dispatch("setwindowwidth", e.target.screen.width);
      });
    });
  }
};
</script>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;
#app {
  @apply font-jenhei;
}
.badge {
  @apply inline-block font-semibold rounded-full px-2 ml-2 text-xs;
}
.badge-red {
  @apply bg-gray-200 bg-red-pure text-gray-100;
}
.board-enter {
  opacity: 0;
  transform: translateY(200px);
}
.board-enter-active,
.board-leave-active {
  transition: all 0.5s ease-out;
}
.board-leave-to {
  opacity: 0;
  transform: translateY(200px);
}
</style>
