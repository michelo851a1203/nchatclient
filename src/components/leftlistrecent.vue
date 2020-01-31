<template>
  <div class="order-3 sm:order-2 mb-auto py-2 overflow-y-auto">
    <transition-group class="cursor-pointer" tag="ul" name="recent" appear>
      <li
        v-for="(item,index) in userlist"
        class="px-3"
        :class="{'bg-gray-listactive':item.userid === selecteduserId}"
        :key="item.userid"
        @click="selectchattarget(item.userid)"
        :style="{'--i':(index + 1)}"
      >
        <div
          class="flex justify-between items-center relative text-gray-300 py-2 border-b-2 sm:border-b-0 border-blue-seperator"
        >
          <div
            class="w-4 h-4 absolute top-0 left-0 mt-2 rounded-full bg-red-pure border-2 border-gray-500"
          ></div>
          <div v-if="!item.isCustomerService || item.headimage !== require('@/assets/logo_black.png')"
            class="bg-transparent w-16 h-16 rounded-full bg-cover bg-center"
            :style="item.headimage | backgroungImage"
          ></div>
          <img v-else style="width:2.95rem;" class="ml-2" :src="item.headimage" alt="">
          <div class="self-strech ml-3 mr-auto">
            <h2 class="font-bold text-base text-gray-listmiddle mb-1 flex items-center">
              <span>{{item.username}}</span>
              <!-- TODO:這裡考慮要從 receiveMsg 那裡取得未讀訊息 -->
              <!-- <span class="badge badge-red">12</span> -->
            </h2>
            <span
              class="text-sm text-blue-leftsubtitle"
            >{{ item.msg && item.msg.msg ? item.msg.msg : ''}}</span>
          </div>
          <div class="px-4 mb-1 self-end">
            <label
              class="text-blue-leftsubtitle text-xs sm:text-sm"
            >{{ item.msg && item.msg.time ? item.msg.time : ''}}</label>
          </div>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  // TODO:這裡要抓取所有的最近，了解一下最近的邏輯。看要怎麼處理
  // TODO:item.msg.msg 要過濾字串的部分。(只能放八個字)
  computed: {
    ...mapGetters(["selecteduserId", "userlist"])
  },
  methods: {
    ...mapActions(["selectchattarget"])
  },
  filters: {
    backgroungImage(val) {
      return `background-image:url('${val}')`;
    }
  }
};
</script>

<style scoped lang="postcss">
.recent-enter {
  opacity: 0;
  transform: translateX(-200px);
}
.recent-enter-active {
  transition: all 0.5s ease;
  transition-delay: calc(0.1s * var(--i));
}
</style>