<template>
  <div
    ref="maininput"
    :style="additionStyle"
    :class="{'relative':!screenisphone,'phone-emojitrans':screenisphone && emojilistshow }"
    class="bg-yellow-navname flex justify-between items-center"
  >
    <transition name="emoji-in">
      <emojilist v-if="emojilistshow"></emojilist>
    </transition>

    <div
      v-if="setreplaytodata !== ''"
      class="replyto w-full h-16 font-bold text-white absolute top-0 px-4 py-6 bg-blue-500 flex justify-between items-center"
    >
      <div>回覆給:{{setreplaytodata}}</div>
      <div @click="setreplayto('')" class="font-bold mr-8 cursor-pointer">&times;</div>
    </div>
    <svg
      @mouseover="emojimouseover"
      @mouseleave="leaveclick"
      @click="phoneemojiClick"
      class="w-10 sm:w-8 ml-4 fill-current text-yellow-icon"
      viewBox="0 0 512 512"
    >
      <path
        d="M256,32C132.281,32,32,132.281,32,256s100.281,224,224,224s224-100.281,224-224S379.719,32,256,32z M256,448
                    c-105.875,0-192-86.125-192-192S150.125,64,256,64s192,86.125,192,192S361.875,448,256,448z M160,192c0-26.5,14.313-48,32-48
                    s32,21.5,32,48c0,26.531-14.313,48-32,48S160,218.531,160,192z M288,192c0-26.5,14.313-48,32-48s32,21.5,32,48
                    c0,26.531-14.313,48-32,48S288,218.531,288,192z M384,288c-16.594,56.875-68.75,96-128,96c-59.266,0-111.406-39.125-128-96"
      />
    </svg>
    <svg
      @click="readytoupload"
      class="w-16 sm:w-10 ml-4 sm:ml-0 fill-current text-yellow-icon"
      viewBox="0 0 96 96"
    >
      <g>
        <path
          d="M38.8,38.8c0,1.5-0.5,2.8-1.6,3.9c-1.1,1.1-2.4,1.6-3.9,1.6s-2.8-0.5-3.9-1.6
                        c-1.1-1.1-1.6-2.4-1.6-3.9c0-1.5,0.5-2.8,1.6-3.9s2.4-1.6,3.9-1.6s2.8,0.5,3.9,1.6C38.3,36,38.8,37.3,38.8,38.8z M68.2,49.8v12.8
                        H27.8v-5.5L37,48l4.6,4.6l14.7-14.7L68.2,49.8z M70.9,29.7H25.1c-0.2,0-0.5,0.1-0.6,0.3c-0.2,0.2-0.3,0.4-0.3,0.6v34.8
                        c0,0.2,0.1,0.5,0.3,0.6c0.2,0.2,0.4,0.3,0.6,0.3h45.8c0.2,0,0.5-0.1,0.6-0.3c0.2-0.2,0.3-0.4,0.3-0.6V30.6c0-0.2-0.1-0.5-0.3-0.6
                        C71.4,29.8,71.2,29.7,70.9,29.7z M75.5,30.6v34.8c0,1.3-0.4,2.3-1.3,3.2c-0.9,0.9-2,1.3-3.2,1.3H25.1c-1.3,0-2.3-0.4-3.2-1.3
                        c-0.9-0.9-1.3-2-1.3-3.2V30.6c0-1.3,0.4-2.3,1.3-3.2c0.9-0.9,2-1.3,3.2-1.3h45.8c1.3,0,2.3,0.4,3.2,1.3
                        C75.1,28.2,75.5,29.3,75.5,30.6z"
        />
      </g>
    </svg>
    <editable :emojiappend="tmpemoji" v-model="sendmsg"></editable>
    <input @change="imagetoPreview" class="hidden" ref="uploadfile" type="file" />
    <button
      @click="sendMessage"
      class="w-btnphone sm:w-btn mr-8 max-w-searchbar focus:outline-none bg-orange-sendbtn hover:bg-orange-700 text-white font-medium py-2 px-4 rounded"
    >发送</button>
  </div>
</template>

<script>
// TODO:開始製作輸入和 html處理 的動作。
import emojilist from "@/components/emojilist.vue";
import editable from "@/components/editable.vue";
import { mapGetters, mapActions } from "vuex";
import { createHelpers } from "vuex-map-fields";

const { mapFields } = createHelpers({
  getterType: "getField",
  mutationType: "updateField"
});
export default {
  components: {
    emojilist,
    editable
  },
  computed: {
    ...mapFields(["sendmsg"]),
    ...mapGetters([
      "screenisphone",
      "emojiheight",
      "tmpemoji",
      "prevshow",
      "emojilistshow",
      "setreplaytodata"
    ]),
    additionStyle() {
      const vm = this;
      if (vm.screenisphone) {
        return `bottom:${vm.emojiheight}px;`;
      } else {
        return "";
      }
    }
  },
  methods: {
    // TODO:記得發送的時候要關上 emoji 的列表
    ...mapActions(["sendMessage", "setemojilistshow", "setreplayto"]),
    phoneemojiClick() {
      const vm = this;
      if (vm.screenisphone) {
        vm.setemojilistshow(!vm.emojilistshow);
      }
    },
    emojimouseover() {
      this.setemojilistshow(!this.screenisphone);
    },
    leaveclick(e) {
      const vm = this;
      if (!vm.screenisphone) {
        const div = vm.$refs.maininput;
        const svgheight = Number(
          window.getComputedStyle(e.target).height.replace("px", "")
        );
        const mainheight = Number(
          window.getComputedStyle(div).height.replace("px", "")
        );
        const svgTop = div.offsetTop + (mainheight - svgheight) / 2;
        if (e.y > svgTop) {
          this.setemojilistshow(false);
        }
      }
      // 這裡有各種需要客服的
    },
    readytoupload() {
      this.$refs.uploadfile.click();
    },
    async imagetoPreview(e) {
      const vm = this;
      const file = e.target.files[0];
      const base64str = await vm.filetobase64(file);
      vm.$store.dispatch("set_previewimage", {
        uploadfile: file,
        imgsrc: base64str
      });
      vm.$store.dispatch("changepreviewshow");
      e.target.value = "";
    },
    filetobase64: file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject("onload fail");
      })
  }
};
</script>

<style scoped lang="postcss">
.replyto {
  margin-top: -4rem;
  background-color: rgba(0, 0, 0, 0.7);
}
.phone-emojitrans {
  @apply fixed bottom-emoji;
  animation: emoji-transanimation 0.4s cubic-bezier(0.5, 0, 0.5, 1);
}
@keyframes emoji-transanimation {
  from {
    bottom: 0;
  }
  to {
    @apply bottom-emoji;
  }
}

.emoji-in-enter {
  opacity: 0;
  transition: translateY(500px);
}
.emoji-in-enter-active,
.emoji-in-leave-active {
  transition: all 0.5s ease-out;
}
.emoji-in-leave-to {
  opacity: 0;
  transition: translateY(500px);
}
</style>