<template>
  <div
    ref="emoji"
    class="text-center"
    @mouseleave="setemojilistshow(false)"
    :class="{'emoji-normal':!screenisphone,'emoji-phone':screenisphone}"
  >
    <div
      @click="appendEmojiToMessage(item.code)"
      v-for="item in emojipath"
      :key="item.imgid"
      class="inline-block w-8 h-8 mx-2 my-1 mx-2 my-1 bg-center bg-no-repeat"
      :style="item.image | backgroungImage"
    ></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["screenisphone", "emojipath"])
  },
  methods: {
    ...mapActions([
      "setemojilistshow",
      "setemojilistheight",
      "appendEmojiToMessage"
    ]),
  },
  filters: {
    backgroungImage(val) {
      return `background-image:url('${val}')`;
    }
  },
  mounted() {
    const vm = this;
    vm.$nextTick(() => {
      const height = Number(
        window.getComputedStyle(vm.$refs.emoji).height.replace("px", "")
      );
      vm.setemojilistheight(height);
    });
  }
};
</script>

<style scoped lang="postcss">
.emoji-normal {
  @apply w-icon h-icon absolute overflow-y-auto top-0 ml-4 mt-emoji rounded shadow-lg px-2 py-4 bg-white;
}
.emoji-phone {
  @apply fixed py-1 bottom-0 bg-white overflow-y-auto;
}
</style>