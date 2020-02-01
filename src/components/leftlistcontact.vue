<template>
  <div class="order-3 sm:order-2 mb-auto py-2 overflow-y-auto">
    <!-- 公眾號 -->
    <div v-if="Object.keys(customerserviceGroup).length > 0">
      <button class="px-3 text-red-level font-bold text-lg focus:outline-none flex items-center">
        <svg class="w-3 fill-current text-red-level" viewBox="0 0 50 50">
          <polygon points="25,0 0,50 50,50" />
        </svg>
        <span class="ml-2">公众号</span>
      </button>
      <ul class="cursor-pointer">
        <li
          @click="selectchattarget(0)"
          class="px-3"
          :class="{'bg-gray-listactive':customerserviceGroup.userid === selecteduserId}"
        >
          <div
            class="flex justify-between items-center relative text-gray-300 py-2 border-b-2 sm:border-b-0 border-blue-seperator"
          >
            <div
              class="w-4 h-4 absolute top-0 left-0 mt-2 rounded-full bg-red-pure border-2 border-gray-500 z-50"
            ></div>
            <div
              v-if="customerserviceGroup.headimage !== require('@/assets/logo_black.png')"
              class="bg-transparent w-16 h-16 rounded-full bg-cover bg-center"
              :style="customerserviceGroup.headimage | backgroungImage"
            ></div>
            <img
              v-else
              style="width:2.95rem;"
              class="ml-2"
              :src="customerserviceGroup.headimage"
              alt
            />
            <div class="self-strech ml-3 mr-auto">
              <h2
                class="font-bold text-base text-gray-listmiddle mb-1 flex items-center"
              >{{customerserviceGroup.username}}</h2>
              <span class="text-sm text-blue-leftsubtitle">
                <span
                  v-if="customerserviceGroup.msg && customerserviceGroup.msg.msg && customerserviceGroup.msg.smsg"
                >
                  <span
                    v-for="sitem in customerserviceGroup.msg.smsg"
                    :key="sitem.key"
                    v-html="sitem.obj"
                  ></span>
                </span>
              </span>
            </div>
            <div class="px-4 mb-1 self-end text-xs sm:text-sm">
              <label class="text-blue-leftsubtitle" for>{{customerserviceGroup.msg.time}}</label>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 上級 -->
    <div v-if="Number(islvtop) !== 1">
      <button
        @click="uppervisible = !uppervisible"
        class="px-3 text-red-level font-bold text-lg focus:outline-none flex items-center"
      >
        <svg class="w-3 fill-current text-red-level" viewBox="0 0 50 50">
          <polygon points="25,0 0,50 50,50" />
        </svg>
        <span class="ml-2">
          我的上级
          <span v-if="!uppervisible && countupper !== 0">({{countupper}})</span>
        </span>
      </button>
      <transition name="left-trans">
        <transition-group v-if="uppervisible" class="cursor-pointer" name="upper" tag="ul" appear>
          <li
            v-for="(item,index) in upLineList"
            :key="item.userid"
            @click="selectchattarget(item.userid)"
            class="px-3"
            :class="{'bg-gray-listactive':item.userid === selecteduserId}"
            :style="{'--i':(index +1)}"
          >
            <div
              class="flex justify-between items-center relative text-gray-300 py-2 border-b-2 sm:border-b-0 border-blue-seperator"
            >
              <div
                class="w-4 h-4 absolute top-0 left-0 mt-2 rounded-full bg-red-pure border-2 border-gray-500 z-50"
              ></div>
              <div
                class="bg-transparent w-16 h-16 rounded-full bg-cover bg-center"
                :style="item.headimage | backgroungImage"
              ></div>
              <div class="self-strech ml-3 mr-auto">
                <h2
                  class="font-bold text-base text-gray-listmiddle mb-1 flex items-center"
                >{{item.username}}</h2>
                <span class="text-sm text-blue-leftsubtitle">
                  <span v-if="item.msg && item.msg.msg && item.msg.smsg">
                    <span v-for="sitem in item.msg.smsg" :key="sitem.key" v-html="sitem.obj"></span>
                  </span>
                </span>
              </div>
              <div class="px-4 mb-1 self-end text-xs sm:text-sm">
                <label
                  class="text-blue-leftsubtitle"
                  for
                >{{ item.msg && item.msg.time ? item.msg.time : ''}}</label>
              </div>
            </div>
          </li>
        </transition-group>
      </transition>
    </div>
    <!-- 下級 -->
    <div v-if="Number(islvtop) === 1 || Number(usertype) === 1">
      <button
        @click="lowervisible = !lowervisible"
        class="px-3 text-red-level font-bold text-lg focus:outline-none flex items-center"
      >
        <svg class="w-3 fill-current text-red-level" viewBox="0 0 50 50">
          <polygon points="25,0 0,50 50,50" />
        </svg>
        <span class="ml-2">
          我的下级
          <span v-if="!lowervisible && countlower !== 0">({{countlower}})</span>
        </span>
      </button>
      <transition name="left-trans">
        <transition-group v-if="lowervisible" class="cursor-pointer" name="lower" tag="ul" appear>
          <li
            v-for="(item,index) in underLineList"
            :key="item.userid"
            @click="selectchattarget(item.userid)"
            :class="{'bg-gray-listactive':item.userid === selecteduserId}"
            class="px-3"
            :style="{'--i':(index + 1)}"
          >
            <div
              class="flex justify-between items-center relative text-gray-300 py-2 border-b-2 sm:border-b-0 border-blue-seperator"
            >
              <div
                class="w-4 h-4 absolute top-0 left-0 mt-2 rounded-full bg-red-pure border-2 border-gray-500 z-50"
              ></div>
              <div
                class="bg-transparent w-16 h-16 rounded-full bg-cover bg-center"
                :style="item.headimage | backgroungImage"
              ></div>
              <div class="self-strech ml-3 mr-auto">
                <h2
                  class="font-bold text-base text-gray-listmiddle mb-1 flex items-center"
                >{{item.username}}</h2>
                <span class="text-sm text-blue-leftsubtitle">
                  <span v-if="item.msg && item.msg.msg && item.msg.smsg">
                    <span v-for="sitem in item.msg.smsg" :key="sitem.key" v-html="sitem.obj"></span>
                  </span>
                </span>
              </div>
              <div class="px-4 mb-1 self-end text-xs sm:text-sm">
                <label class="text-blue-leftsubtitle" for>{{item.msg.time}}</label>
              </div>
            </div>
          </li>
        </transition-group>
      </transition>
    </div>
  </div>
</template>

<script>
// TODO:item.msg.msg 要過濾字串的部分。(只能放八個字)
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return { uppervisible: true, lowervisible: true };
  },
  computed: {
    ...mapGetters([
      "selecteduserId",
      "islvtop",
      "usertype",
      "customerserviceGroup",
      "upLineList",
      "underLineList"
    ]),
    countupper() {
      return this.upLineList.length;
    },
    countlower() {
      return this.underLineList.length;
    }
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
.upper-enter,
.lower-enter {
  opacity: 0;
  transform: translateX(-200px);
}
.upper-enter-active,
.lower-enter-active {
  transition: all 0.5s ease;
  transition-delay: calc(0.1s * var(--i));
}

.left-trans-leave-active {
  transition: all 0.5s ease;
}
.left-trans-leave-to {
  opacity: 0;
  transform: translateX(200px);
}
</style>