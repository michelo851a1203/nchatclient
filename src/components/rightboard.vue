<template>
  <div
    ref="scrollingdiv"
    @scroll="contentscroll"
    @click="setemojilistshow(false)"
    class="scroll-smooth overflow-y-auto h-full max-h-contentphone sm:max-h-content"
  >
    <div
      ref="`section_${item.id}`"
      @dblclick="setreplayto(item.msg)"
      v-for="item in chatcontent"
      :key="item.id"
      :class="{'justify-end':item.is_sender}"
      class="target px-6 py-4 flex items-end select-none"
    >
      <div
        :class="{'order-3':item.is_sender,'self-triangle':item.is_sender,'target-triangle':!item.is_sender}"
      ></div>
      <section
        :class="{'order-2':item.is_sender,
        'bg-yellow-active':item.is_sender,
        'bg-gray-targetchat':!item.is_sender
        }"
        class="max-w-1/2 sm:max-w-2/3 text-sm sm:text-base rounded-lg px-3 py-2 font-medium break-all"
      >
        <span v-for="msgitem in item.msg" :key="msgitem.key" v-html="msgitem.obj"></span>
      </section>
      <div
        :class="{'order-1':item.is_sender,'mr-3':item.is_sender,'ml-3':!item.is_sender}"
        class="text-sm sm:text-base text-gray-chatdate"
      >{{item.time}}</div>
    </div>

    <transition name="trans">
      <button
        v-if="tobottombuttonshow"
        @click="scrolltobottomclick"
        class="w-16 h-16 rounded-full focus:outline-none bg-orange-sendbtn shadow-lg tobottom"
      >
        <svg
          class="w-16 fill-current text-gray-400"
          viewBox="0 0 960 560"
          enable-background="new 0 0 960 560"
        >
          <g id="Rounded_Rectangle_33_copy_4_1_">
            <path
              d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937
            c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937
            c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"
            />
          </g>
        </svg>
      </button>
    </transition>
  </div>
</template>

<script>
// 因為 contentOffset 的部分也會隨著調整螢幕的方式改變
// TODO:返回收起來的特效沒有做。
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "chatcontent",
      "contentoffsettop",
      "contentheight",
      "contentscrollheight",
      "currentscrollposition",
      "chatsizing",
      "tobottombuttonshow"
    ])
  },
  methods: {
    ...mapActions(["setreplayto", "setemojilistshow"]),
    contentscroll(e) {
      const div = e.target;
      const vm = this;
      vm.$store.dispatch("setcurrentscrollposition", div.scrollTop);
      if (div.scrollTop === 0 && vm.chatcontent.length > 0) {
        vm.$store.dispatch("getPrevious", vm.chatcontent[0].id);
      }
      const contenth = vm.contentheight;
      const scrollBottom = div.scrollTop + contenth;
      vm.chatsizing.forEach(element => {
        if (element.offsetBottom <= scrollBottom) {
          const readedchatid = element.id.replace("section_", "");
          vm.$store.dispatch("setreaded", readedchatid);
        }
      });
      // 這裡要做捲動事件，如果最底往上一半螢幕寬要秀出
      if (scrollBottom <= vm.contentscrollheight - 0.5 * vm.contentheight) {
        vm.$store.dispatch("set_tobottombuttonshow", true);
      } else {
        vm.$store.dispatch("set_tobottombuttonshow", false);
      }
    },
    scrolltobottomclick() {
      // 全部滾到最底，而且全設已讀
      const vm = this;
      const scrolldiv = vm.$refs.scrollingdiv;
      const scrollTopOfBottom = vm.contentscrollheight - vm.contentheight;
      scrolldiv.scrollTop = scrollTopOfBottom;
      const maxid = vm.chatcontent.reduce((prev, next) => {
        const prevvalue =
          prev && prev.id && !isNaN(prev.id) ? Number(prev.id) : 0;
        const nextvalue =
          next && next.id && !isNaN(next.id) ? Number(next.id) : 0;
        return { id: Math.max(prevvalue, nextvalue) };
      });
      vm.$store.dispatch("setreaded", maxid);
      vm.$store.dispatch("set_tobottombuttonshow", false);
    }
  },
  watch: {
    contentheight(val) {
      const vm = this;
      const div = vm.$refs.scrollingdiv;
      vm.$store.dispatch("setcurrentscrollposition", div.scrollTop);
      const scrollbottom = div.scrollTop + val;
      const targetBottom = vm.contentscrollheight - val * 0.5;
      if (scrollbottom <= targetBottom) {
        vm.$store.dispatch("set_tobottombuttonshow", true);
      } else {
        vm.$store.dispatch("set_tobottombuttonshow", false);
      }

      // TODO:這裡可能要處理 unread 問題，計算現在位置。
    },
    contentscrollheight(val, oldvalue) {
      const vm = this;
      const div = vm.$refs.scrollingdiv;
      const newBottomScrollTop = val - vm.contentheight;
      if (oldvalue !== vm.contentheight) {
        // 已經有滾軸存在了
        const scrollBottom = vm.currentscrollposition + vm.contentheight;
        if (oldvalue === scrollBottom) {
          // 之前是頂到最底 => 則頂到最底
          vm.$store.dispatch("setcurrentscrollposition", newBottomScrollTop);
          div.scrollTop = newBottomScrollTop;
          // TODO:感覺這個setreadead沒寫完
          vm.$store.dispatch("setreaded");
        }
      } else {
        // 代表在新增前還沒有滾軸，這裡觸發代表第一次產生滾軸 => 直接頂到最底
        vm.$store.dispatch("setcurrentscrollposition", newBottomScrollTop);
        div.scrollTop = newBottomScrollTop;
      }
    }
  },
  mounted() {
    const vm = this;
    vm.$nextTick(() => {
      const div = vm.$refs.scrollingdiv;
      vm.$store.dispatch("setcontentscrollheight", div.scrollHeight);
      const inioffsettop = div.offsetTop;
      vm.$store.dispatch("setcontentheight", {
        contentoffsettop: inioffsettop,
        contentheight: Number(
          window.getComputedStyle(div).height.replace("px", "")
        )
      });
      window.addEventListener("resize", () => {
        vm.$store.dispatch("setcontentheight", {
          contentoffsettop: div.offsetTop,
          contentheight: Number(
            window.getComputedStyle(div).height.replace("px", "")
          )
        });
      });
      for (const key in vm.$refs) {
        if (key.split("_")[0] === "section") {
          const obj = vm.$refs[key][0];
          const elementh = Number(
            window.getComputedStyle(obj).height.replace("px", "")
          );
          vm.$store.dispatch("addchatsizing", {
            id: key,
            offsetBottom: obj.offsetTop + elementh - inioffsettop
          });
        }
      }
    });
  },
  updated() {
    const vm = this;
    const div = vm.$refs.scrollingdiv;
    vm.$store.dispatch("setcontentscrollheight", div.scrollHeight);
    // TODO:如果目前滾在最底下，這邊收到訊息要視為已讀並滾到最下方
  }
};
</script>

<style scoped lang="postcss">
.self-triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 1.5rem 0 0 1.25rem;
  border-color: transparent transparent transparent #d4b77e;
  margin-left: -0.5rem;
}
.target-triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 1.25rem 1.5rem;
  border-color: transparent transparent #dbdbdb transparent;
  margin-right: -0.5rem;
}
.tobottom {
  position: fixed;
  right: 3rem;
  top: 0;
  margin-top: 70vh;
}

.trans-enter {
  transform: translateY(100px);
}
.trans-enter-active,
.trans-leave-active {
  transition: all 0.1s ease-out;
}
.trans-leave-to {
  transform: translateY(100px);
}
.scroll-smooth {
  scroll-behavior: smooth;
}
</style>