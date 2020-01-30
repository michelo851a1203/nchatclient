<template>
  <div>
    <div class="bg-yellow-navname px-8 py-2 sm:py-5 flex items-center">
      <!-- TODO:這裡要做一個手機板面有的響應式返回 -->
      <button @click="selectchattarget(-1)"
        v-if="screenisphone"
        class="px-2 py-1 mr-auto flex items-center focus:outline-none"
      >
        <svg class="w-8" viewBox="0 0 21 21">
          <g transform="translate(-253 -244)">
            <rect style="fill:none;" width="21" height="21" transform="translate(253 244)" />
            <g transform="translate(363.979 261) rotate(180)">
              <path
                class="cls-2"
                d="M103.732,6.594l-5.16,5.16a.84.84,0,1,1-1.189-1.188L101.95,6,97.385,1.434A.84.84,0,0,1,98.573.246l5.16,5.16a.84.84,0,0,1,0,1.188Z"
                transform="translate(0 0)"
              />
            </g>
          </g>
        </svg>
        <label class="font-bold">返回</label>
      </button>
      <svg class="w-6 stroke-current fill-current text-gray-700" viewBox="0 -256 1792 1792">
        <g transform="matrix(1,0,0,-1,197.42373,1300.6102)">
          <path
            d="M 1408,131 Q 1408,11 1335,-58.5 1262,-128 1141,-128 H 267 Q 146,-128 73,-58.5 0,11 0,131 0,184 3.5,234.5 7,285 17.5,343.5 28,402 44,452 q 16,50 43,97.5 27,47.5 62,81 35,33.5 85.5,53.5 50.5,20 111.5,20 9,0 42,-21.5 33,-21.5 74.5,-48 41.5,-26.5 108,-48 Q 637,565 704,565 q 67,0 133.5,21.5 66.5,21.5 108,48 41.5,26.5 74.5,48 33,21.5 42,21.5 61,0 111.5,-20 50.5,-20 85.5,-53.5 35,-33.5 62,-81 27,-47.5 43,-97.5 16,-50 26.5,-108.5 10.5,-58.5 14,-109 Q 1408,184 1408,131 z m -320,893 Q 1088,865 975.5,752.5 863,640 704,640 545,640 432.5,752.5 320,865 320,1024 320,1183 432.5,1295.5 545,1408 704,1408 863,1408 975.5,1295.5 1088,1183 1088,1024 z"
          />
        </g>
      </svg>
      <label class="ml-4 font-bold text-gray-700" for>{{selecteduserName}}</label>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["screenisphone", "selecteduserName"])
  },
  methods: {
    ...mapActions(["selectchattarget"])
  }
};
</script>

<style scoped lang="postcss">
</style>