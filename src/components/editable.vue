<template>
  <div
    ref="editable"
    @keyup="keyupClick"
    @input="listenMsg"
    @keydown="getcaret"
    @mouseup="getcaret"
    @mousedown="getcaret"
    @paste.prevent="pastetoText"
    class="w-10/12 px-8 py-5 fake-input focus:outline-none max-w-searchbar"
    placeholder="输入讯息...."
    contenteditable
  ></div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    value: {
      default: ""
    },
    emojiappend: {
      default: null
    }
  },
  computed: {
    ...mapGetters(["editablecurrentNode", "getSendMsg", "getemojiObject"])
  },
  watch: {
    emojiappend(val) {
      const vm = this;
      const div = vm.$refs.editable.innerHTML;
      if (val) {
        div.innerHTML += val;
        vm.$emit("input", div.innerHTML);
      }
    },
    getSendMsg(val, oldval) {
      const vm = this;
      const edit = vm.$refs.editable;
      if (oldval !== "" && val === "") {
        edit.innerHTML = "";
      }
      const prevNodeNum = vm.editablecurrentNode.prevNodeNum;
      const textNum = vm.editablecurrentNode.textNum;
      if (vm.getemojiObject) {
        let currentcaret = false;
        const prevlen = edit.childNodes.length;
        if (prevlen === prevNodeNum && textNum === 0) {
          // 代表caret目前在最後一位
          currentcaret = true;
        }
        vm.$nextTick(() => {
          const range = document.createRange();
          const sel = window.getSelection();
          const contentNode = edit.childNodes;
          const last = contentNode[contentNode.length - 1];
          if (last) {
            if (currentcaret) {
              range.setStart(edit, contentNode.length);
              vm.$store.dispatch("setCurrentnode", {
                prevNodeNum: contentNode.length,
                textNum: 0
              });
              // ?這裡要檢查一下，最後增加字數是否正確
            } else {
              if (contentNode.length > prevlen) {
                const add = contentNode.length - prevlen;
                if (contentNode[prevNodeNum].nodeType === Node.TEXT_NODE) {
                  const rightisemoji =
                    contentNode[prevNodeNum + add].nodeType ===
                    Node.ELEMENT_NODE;
                  if (rightisemoji) {
                    range.setStart(edit, prevNodeNum + add + 1);
                    vm.$store.dispatch("setCurrentnode", {
                      prevNodeNum: prevNodeNum + add + 1,
                      textNum: 0
                    });
                  } else {
                    range.setStart(contentNode[prevNodeNum + 2], 0);
                    vm.$store.dispatch("setCurrentnode", {
                      prevNodeNum: prevNodeNum + 2,
                      textNum: 0
                    });
                  }
                } else {
                  range.setStart(contentNode[prevNodeNum + add], textNum);
                  vm.$store.dispatch("setCurrentnode", {
                    prevNodeNum: prevNodeNum + add,
                    textNum: textNum
                  });
                }
              } else {
                const diff = val.length - oldval.length;
                if (contentNode.length === prevlen && diff > 0) {
                  // 這裡會增加字數代表複製貼上。
                  vm.$store.dispatch("setCurrentnode", {
                    prevNodeNum: prevNodeNum,
                    textNum: textNum + diff
                  });
                } else {
                  let newNodeNum = 0;
                  let newtextNum = 0;
                  if (textNum === 0 && prevNodeNum !== 0) {
                    newNodeNum = prevNodeNum - 1;
                  } else {
                    newtextNum = textNum !== 0 ? textNum - 1 : 0;
                  }
                  vm.$store.dispatch("setCurrentnode", {
                    prevNodeNum: newNodeNum,
                    textNum: newtextNum
                  });
                }
              }
            }
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
          edit.focus();
        });
      }
    },
    getemojiObject(val) {
      if (val) {
        this.addobjonhtml(val);
      }
    }
  },
  methods: {
    listenMsg(e) {
      // OK 這樣驅動的時候就是EMOJI 的部分了
      const decodeEmojiStr = [...e.target.childNodes]
        .map(item => {
          if (item.nodeType === Node.ELEMENT_NODE) {
            return item.outerHTML.replace(
              /<img src="\/.*?\/(\d{1,3})\..*?\.svg".*?>/g,
              "#-EMOJI$1EMOJI-#"
            );
          } else {
            return item.textContent;
          }
        })
        .join("");
      // 這裡要對 childNode 進行一些拆解的動作。
      this.$emit("input", decodeEmojiStr);
    },
    keyupClick(e) {
      const vm = this;
      if (e.key === "Enter") {
        vm.$store.dispatch("sendMessage", "enter");
      } else {
        vm.getcaret();
      }
    },
    getcaret() {
      const vm = this;
      const contentDiv = vm.$refs.editable;
      const sel = window.getSelection();
      if (sel.focusNode && sel.focusNode.nodeType === Node.ELEMENT_NODE) {
        const prevNodeNum = sel.anchorOffset;
        vm.$store.dispatch("setCurrentnode", {
          prevNodeNum,
          textNum: 0
        });
      } else if (sel.focusNode && sel.focusNode.nodeType === Node.TEXT_NODE) {
        const textNum = sel.anchorOffset;
        const prevNode = sel.baseNode.previousElementSibling;
        if (prevNode) {
          const contentIndex = [...contentDiv.childNodes].findIndex(
            item => item === prevNode
          );
          vm.$store.dispatch("setCurrentnode", {
            prevNodeNum: contentIndex + 1,
            textNum
          });
        } else {
          vm.$store.dispatch("setCurrentnode", {
            prevNodeNum: 0,
            textNum
          });
        }
      }
    },
    addobjonhtml(obj) {
      const vm = this;
      const edit = vm.$refs.editable;
      const prevNodeNum = vm.editablecurrentNode.prevNodeNum;
      const textNum = vm.editablecurrentNode.textNum;
      let node = null;
      if (typeof obj === "string") {
        node = document.createTextNode(obj);
      } else {
        node = obj;
      }

      if (textNum === 0) {
        if (prevNodeNum === 0) {
          edit.appendChild(node);
        } else {
          edit.insertBefore(node, edit.childNodes[prevNodeNum]);
        }
      } else {
        const txt = edit.childNodes[prevNodeNum].textContent;
        if (typeof obj === "string") {
          const p1 = txt.slice(0, textNum);
          const p2 = txt.slice(textNum, txt.length);
          edit.childNodes[prevNodeNum].textContent = `${p1}${obj}${p2}`;
        } else {
          if (txt.length === textNum) {
            edit.insertBefore(obj, edit.childNodes[prevNodeNum + 1]);
          } else {
            const p1 = txt.slice(0, textNum);
            const p2 = txt.slice(textNum, txt.length);
            const text1 = document.createTextNode(p1);
            const text2 = document.createTextNode(p2);
            edit.insertBefore(text2, edit.childNodes[prevNodeNum]);
            edit.insertBefore(obj, edit.childNodes[prevNodeNum]);
            edit.insertBefore(text1, edit.childNodes[prevNodeNum]);
            edit.childNodes[prevNodeNum + 3].remove();
          }
        }
      }
    },
    pastetoText(e) {
      // 這裡要直接把 HTML 加入。
      const vm = this;
      const cliptext = e.clipboardData.getData("Text");
      vm.addobjonhtml(cliptext);
      vm.$store.dispatch("addpastetext", cliptext);
    }
  },
  mounted() {
    this.$refs.editable.innerHTML = this.value;
  }
};
</script>

<style scoped lang="postcss">
.fake-input[placeholder]:empty:before {
  content: attr(placeholder);
  /* color:#555; */
  @apply font-bold text-gray-inputmsgplaceholder;
}
</style>