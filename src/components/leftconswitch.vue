<template>
  <div
    class="order-1 bg-gray-leftboard flex justify-around border-b-3 border-blue-seperator cursor-pointer"
  >
    <!-- 左側最近 -->
    <div
      @click="switchlist('leftlistrecent')"
      :class="{'list-active':activenavlist === 'leftlistrecent','list':activenavlist !== 'leftlistrecent'}"
      class="flex justify-center items-center px-6 py-4 w-full"
    >
      <svg class="w-6 fill-current" viewBox="0 0 128 128">
        <path
          d="M 64 13.5 C 36.2 13.5 13.5 36.2 13.5 64 C 13.5 91.8 36.2 114.5 64 114.5 C 91.8 114.5 114.5 91.8 114.5 64 C 114.5 36.2 91.8 13.5 64 13.5 z M 64 19.5 C 88.5 19.5 108.5 39.5 108.5 64 C 108.5 88.5 88.5 108.5 64 108.5 C 39.5 108.5 19.5 88.5 19.5 64 C 19.5 39.5 39.5 19.5 64 19.5 z M 64 31 C 62.3 31 61 32.3 61 34 L 61 58.800781 C 59.2 59.800781 58 61.8 58 64 C 58 67.3 60.7 70 64 70 C 66.2 70 68.199219 68.8 69.199219 67 L 84 67 C 85.7 67 87 65.7 87 64 C 87 62.3 85.7 61 84 61 L 69.199219 61 C 68.699219 60.1 67.9 59.300781 67 58.800781 L 67 34 C 67 32.3 65.7 31 64 31 z"
        />
      </svg>
      <label class="font-bold text-lg">最近</label>
    </div>
    <!-- 右側聯絡人 -->
    <div
      @click="switchlist('leftlistcontact')"
      :class="{'list-active':activenavlist === 'leftlistcontact','list':activenavlist !== 'leftlistcontact'}"
      class="flex justify-center items-center px-6 py-4 w-full"
    >
      <svg class="w-6 fill-current" viewBox="0 -256 1792 1792">
        <g transform="matrix(1,0,0,-1,197.42373,1300.6102)">
          <path
            d="M 1408,131 Q 1408,11 1335,-58.5 1262,-128 1141,-128 H 267 Q 146,-128 73,-58.5 0,11 0,131 0,184 3.5,234.5 7,285 17.5,343.5 28,402 44,452 q 16,50 43,97.5 27,47.5 62,81 35,33.5 85.5,53.5 50.5,20 111.5,20 9,0 42,-21.5 33,-21.5 74.5,-48 41.5,-26.5 108,-48 Q 637,565 704,565 q 67,0 133.5,21.5 66.5,21.5 108,48 41.5,26.5 74.5,48 33,21.5 42,21.5 61,0 111.5,-20 50.5,-20 85.5,-53.5 35,-33.5 62,-81 27,-47.5 43,-97.5 16,-50 26.5,-108.5 10.5,-58.5 14,-109 Q 1408,184 1408,131 z m -320,893 Q 1088,865 975.5,752.5 863,640 704,640 545,640 432.5,752.5 320,865 320,1024 320,1183 432.5,1295.5 545,1408 704,1408 863,1408 975.5,1295.5 1088,1183 1088,1024 z"
          />
        </g>
      </svg>
      <label class="font-bold text-lg">联系人</label>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["activenavlist"])
  },
  // 這裡要作物見切換的動作
  methods: {
    ...mapActions(["switchlist"])
    // 考慮這個 bar 要做一個簡單的動畫，利用 transition
  }
};
</script>

<style scoped lang="postcss">
.list-active {
  @apply border-b-5 border-yellow-active;
}
.list-active svg {
  @apply text-yellow-active;
}
.list-active label {
  @apply text-yellow-active;
}
.list svg {
  @apply text-gray-listtext;
}
.list label {
  @apply text-gray-listtext;
}
</style>
