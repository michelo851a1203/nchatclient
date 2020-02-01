import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connect: false,
    windowWidth: window.screen.width,
    personaldata: {
      id: -1,
      username: '',
      islvtop: 0,
      usertype: 0
    },
    left: {
      userlist: {
        listactivestatus: 'leftlistrecent',
        userlist: [
          {
            username: "三牛娱乐官方",
            userid: 0,
            headimage: null,
            isCustomerService: true,
          }
        ],
        selecteduserid: -1,
      },
    },
    right: {
      chatlist: [],
      scrollcontent: {
        contentoffsettop: 0,
        contentheight: 0,
      },
      contentscrollheight: 0,
      currentscrollposition: 0,
      chatsizing: [],
      readedchatid: 0,
      emojilist: [1, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
      replytotext: '',
    },
    preview: {
      prevshow: false,
      imgsrc: '',
      uploadfile: null,
    },
    search: '',
    sendmsg: '',
    emojiObjectformessage: null,
    emojilistshow: false,
    tmpemoji: null,
    emojilistheight: 0,
    tobottombuttonshow: false,
    alert: {
      isshow: false,
      alertMsg: '',
      status: 'alert-gray',
    },
    currentNode: {
      prevNodeNum: 0,
      textNum: 0
    },
    mainImagesrc: require('@/assets/biglogo.png')
  },
  mutations: {
    updateField,
    SET_WINDOWWIDTH(state, width) {
      state.windowWidth = width
    },
    SET_CONNECT(state, connect) {
      state.connect = connect;
    },
    SET_PERSONALINFO(state, { id, username, islvtop, usertype }) {
      const person = state.personaldata
      person.id = id
      person.username = username
      person.islvtop = islvtop
      person.usertype = usertype
    },
    SET_SWITCHLIST(state, listname) {
      state.left.userlist.listactivestatus = listname
      state.search = ''
    },
    SET_USERLIST(state, userlist) {
      state.left.userlist.userlist = userlist
    },
    SET_SELECTED_USERID(state, userid) {
      state.left.userlist.selecteduserid = userid
    },
    SET_CHATLIST(state, chatlist) {
      state.right.chatlist = chatlist
    },
    PREPEND_CHATLIST(state, chatlist) {
      state.right.chatlist = [...chatlist, ...state.right.chatlist]
    },
    ADD_CHATLOG(state, chatdata) {
      state.right.chatlist.push(chatdata)
    },
    UPDATE_USERSUBTITLE(state, { selectedIndex, id, is_sender, msg, time }) {
      const userObj = state.left.userlist.userlist[selectedIndex]
      if (userObj.msg) {
        userObj.msg.is_sender = is_sender
        userObj.msg.id = id
        userObj.msg.msg = msg
        userObj.msg.time = time
      } else {
        userObj.msg = {
          is_sender: true,
          id,
          sender_id: state.personaldata.id,
          msg,
          time
        }
      }
    },
    SET_TMPEMOJI(state, emojihtml) {
      state.tmpemoji = emojihtml
    },
    EMPTY_SEND_MSG(state) {
      state.sendmsg = ''
    },
    SET_MESSAGE(state, message) {
      state.sendmsg = message
    },
    SET_APPENDEDEMOJI(state, payload) {
      state.emojiObjectformessage = payload
    },
    SET_CONTENTOFFSET(state, contentoffsettop) {
      state.right.scrollcontent.contentoffsettop = contentoffsettop
    },
    SET_CONTENTHIGHT(state, contentheight) {
      state.right.scrollcontent.contentheight = contentheight
    },
    SET_CONTENTSCROLLHEIGHT(state, contentscrollheight) {
      state.right.contentscrollheight = contentscrollheight
    },
    SET_CURRENTSCROLLPOSITION(state, currentscrollposition) {
      state.right.currentscrollposition = currentscrollposition
    },
    ADD_CHATSIZING(state, chatsizingobj) {
      state.right.chatsizing.push(chatsizingobj)
    },
    EMPTY_CHATSIZING(state) {
      state.right.chatsizing = []
    },
    SET_READEDID(state, { index, chatid, unreadcount }) {
      const userlist = state.left.userlist.userlist
      userlist[index].readedid = chatid
      userlist[index].unreadcount = unreadcount
    },
    CHANGE_PREVIEW_SHOW(state, prevshow) {
      state.preview.prevshow = prevshow
    },
    SET_EMOJILIST_SHOW(state, emojilistshow) {
      state.emojilistshow = emojilistshow
    },
    SET_UPLOADFILE(state, uploadfile) {
      state.preview.uploadfile = uploadfile
    },
    SET_PREVIEWIMAGE(state, imgsrc) {
      state.preview.imgsrc = imgsrc
    },
    SET_TOBOTTOMBUTTONSHOW(state, isshow) {
      state.tobottombuttonshow = isshow
    },
    SET_REPLAYTO(state, reply) {
      state.right.replytotext = reply
    },
    SET_ALERTSHOW(state, payload) {
      state.alert.isshow = payload
    },
    SET_ALERTMSG(state, payload) {
      state.alert.alertMsg = payload
    },
    SET_ALERTSTATUS(state, payload) {
      state.alert.status = payload
    },
    SET_EMOJILISTHEIGHT(state, payload) {
      state.emojilistheight = payload
    },
    SET_CURRENTNODE(state, { prevNodeNum, textNum }) {
      state.currentNode.prevNodeNum = prevNodeNum
      state.currentNode.textNum = textNum
    },
    SET_CUSTOMSERVICEIMAGE(state, { imageUrl, officalIndex }) {
      // 客服系統更新官方照片觸發
      state.left.userlist.userlist[officalIndex].headimage = imageUrl
    }
  },
  actions: {
    socket_connect({ commit, state }) {
      if (!state.connect) {
        commit('SET_CONNECT', true)
      }
    },
    socket_disconnect({ commit, state }) {
      if (state.connect) {
        commit('SET_CONNECT', false)
        this.dispatch('setalert', {
          isshow: true,
          alertMsg: '用户掉线',
          status: 'alert-danger',
          lastingtime: 5000,
        })
      }
    },
    socket_reconnect({ commit, state }) {
      if (!state.connect) {
        commit('SET_CONNECT', true)
        this.dispatch('setalert', {
          isshow: true,
          alertMsg: '重新连线成功',
          status: 'alert-safe',
          lastingtime: 5000,
        })
      }
    },
    socket_personalinfo({ commit }, { id, username, islvtop, usertype }) {
      if (id) {
        commit('SET_PERSONALINFO', { id, username, islvtop, usertype })
      }
    },
    socket_backcontact({ commit }, payload) {
      const newpayload = payload.map(item => {
        if (!item.headimage) {
          if (item.isCustomerService === true) {
            item.headimage = require('@/assets/logo_black.png')
          } else {
            item.headimage = require('@/assets/userImg.png')
          }
        }
        return item
      })
      commit('SET_USERLIST', newpayload)
    },
    socket_backchatlog({ commit }, payload) {
      commit('SET_CHATLIST', payload)
    },
    socket_backprevious({ commit }, payload) {
      if (payload.length > 0) {
        commit('PREPEND_CHATLIST', payload)
      }
    },
    socket_receiveMsg({ commit, state }, payload) {
      // TODO:如果現在右側是最底則直接增加並且到最下方
      // TODO:如果不適最底則視為未讀，拉到的位置才要取消未讀數
      const selectedIndex = state.left.userlist.userlist.findIndex(item => {
        return item.userid === state.left.userlist.selecteduserid
      })
      payload.smsg = emojiConvert(payload.msg)
      commit('UPDATE_USERSUBTITLE', {
        selectedIndex,
        id: payload.id,
        is_sender: payload.is_sender,
        msg: payload.msg,
        time: payload.time,
      })
      commit('ADD_CHATLOG', payload)
      commit('EMPTY_SEND_MSG')
      commit('SET_CURRENTNODE', {
        prevNodeNum: 0,
        textNum: 0
      })
    },
    socket_receivedunread({ commit, state }, { senderuserid, chatid, unreadcount }) {
      const userlist = state.left.userlist.userlist
      const index = userlist.findIndex(item => {
        return item.userid === senderuserid
      })
      if (index > -1) {
        commit('SET_READEDID', {
          index,
          chatid,
          unreadcount
        })
      }
      // TODO:這裡要判斷如果非本人收到且目前在最底下要回傳已讀且要棍到最底下
    },
    socket_customserviceImageToClient({ commit, state }, { userid, imageUrl }) {
      if (userid === state.personaldata.id) {
        const official = state.left.userlist.userlist.find(item => item.isCustomerService)
        const officalIndex = state.left.userlist.userlist.findIndex(item => item.isCustomerService)
        if (official) {
          if (!official.headimage) {
            commit('SET_CUSTOMSERVICEIMAGE', { imageUrl, officalIndex })
          } else {
            if (official.headimage !== imageUrl) {
              commit('SET_CUSTOMSERVICEIMAGE', { imageUrl, officalIndex })
            }
          }
        }
      }
    },
    setwindowwidth({ commit, state }, width) {
      if (state.windowWidth !== width) {
        commit('SET_WINDOWWIDTH', width)
      }
    },
    switchlist({ commit }, listname) {
      commit('SET_SWITCHLIST', listname)
    },
    selectchattarget({ commit, state }, userid) {
      // 這個是取得完整對話內容
      if (state.left.userlist.selecteduserid !== userid) {
        commit('SET_SELECTED_USERID', userid)
        if (userid !== -1 && state.connect === true) {
          const vue = new Vue()
          vue.$socket.emit('getChatLog', {
            touserid: userid,
          })
        }
      }
    },
    getPrevious({ state }, minchatid) {
      if (state.connect === true && state.left.userlist.selecteduserid !== -1) {
        const vue = new Vue()
        vue.$socket.emit('getprevious', {
          chatid: minchatid,
          userid: state.left.userlist.selecteduserid
        })
      }
    },
    set_tmpemoji({ commit }, tmpemoji) {
      commit('SET_TMPEMOJI', tmpemoji)
      setTimeout(() => {
        commit('SET_MESSAGE', null)
      }, 0);
    },
    appendEmojiToMessage({ commit, state }, payload) {
      if (!state.emojiObjectformessage) {
        const image = new Image()
        const num = payload.replace(/#-EMOJI(\d{1,3})EMOJI-#/g, '$1')
        image.src = require(`@/assets/emoji/${num}.svg`)
        image.width = 20
        image.classList.add('inline-block')
        commit('SET_APPENDEDEMOJI', image)
        let sendmsgArr = state.sendmsg.split(/(#-EMOJI\d{1,3}EMOJI-#)/g).filter(item => item !== '')
        const prevNodeNum = state.currentNode.prevNodeNum
        const textNum = state.currentNode.textNum
        if (textNum === 0) {
          sendmsgArr.splice(prevNodeNum, 0, payload)
        } else {
          const textNode = sendmsgArr[prevNodeNum]
          if (textNode.length === textNum) {
            sendmsgArr.splice(prevNodeNum + 1, 0, payload)
          } else {
            sendmsgArr = [
              ...sendmsgArr.filter((_, index) => index < prevNodeNum),
              textNode.slice(0, textNum), payload, textNode.slice(textNum, textNode.length),
              ...sendmsgArr.filter((_, index) => index > prevNodeNum)
            ]
          }
        }
        commit('SET_MESSAGE', sendmsgArr.join(''))
      }
      setTimeout(() => {
        commit('SET_APPENDEDEMOJI', null)
      }, 0);
    },
    sendMessage({ state }) {
      // process : client:send > server:emit > client:receive > 
      // (get current bottom ) send readed >  change readed
      // 這裡要留意 emoji 和 圖檔的部分
      if (state.sendmsg !== '' && state.left.userlist.selecteduserid !== -1) {
        // 關於 replyto 可以沒有。
        if (state.connect === true) {
          const vue = new Vue()
          vue.$socket.emit('sendMsg', {
            touserid: state.left.userlist.selecteduserid,
            msg: state.sendmsg,
            replyto: 0,
          })
        }
      }
    },
    setcontentheight({ commit, state }, { contentoffsettop, contentheight }) {
      if (state.right.scrollcontent.contentoffsettop !== contentoffsettop) {
        commit('SET_CONTENTOFFSET', contentoffsettop)
      }
      if (state.right.scrollcontent.contentheight !== contentheight) {
        commit('SET_CONTENTHIGHT', contentheight)
      }
    },
    setcontentscrollheight({ commit, state }, contentscrollheight) {
      if (state.right.contentscrollheight !== contentscrollheight) {
        commit('SET_CONTENTSCROLLHEIGHT', contentscrollheight)
      }
    },
    setcurrentscrollposition({ commit, state }, currentscrollposition) {
      if (state.right.currentscrollposition !== currentscrollposition) {
        commit('SET_CURRENTSCROLLPOSITION', currentscrollposition)
      }
    },
    addchatsizing({ commit, state }, chatsizingobj) {
      const chatsizing = state.right.chatsizing
      const index = chatsizing.findIndex(item => {
        if (item.id) {
          return item.id === chatsizingobj.id
        } else {
          return false
        }
      })
      if (index === -1) {
        commit('ADD_CHATSIZING', chatsizingobj)
      }
    },
    emptychatsizing({ commit }) {
      commit('EMPTY_CHATSIZING')
    },
    setreaded({ state }, readedchatid) {
      // TODO:這裡疑似有寫錯，要檢查一下
      // 會觸發這個的有三個狀態，發訊息時還有滾動時還有目前頂到最底時
      const userid = state.personaldata.id
      const senderuserid = state.left.userlist.selecteduserid
      if (senderuserid !== -1 && userid !== -1) {
        const userdata = state.left.userlist.userlist.find(item => {
          return item.userid === senderuserid
        })
        if (Object.keys(userdata).length > 0) {
          const vue = new Vue()
          if (userdata.readedchatid) {
            if (readedchatid > userdata.readedchatid) {
              // 這裡用 Vuex
              // userdata.readedchatid = readedchatid  
              if (state.connect === true) {
                vue.$socket.emit('setreaded', {
                  chatid: readedchatid,
                  userid,
                  senderuserid,
                })
              }
            }
          } else {
            // 這裡用 Vuex 但先用 socket
            // userdata.readedchatid = readedchatid
            if (state.connect === true) {
              vue.$socket.emit('setreaded', {
                chatid: readedchatid,
                userid,
                senderuserid,
              })
            }
          }
        }
      }
    },
    setemojilistshow({ commit, state }, emojilistshow) {
      if (state.emojilistshow !== emojilistshow) {
        commit('SET_EMOJILIST_SHOW', emojilistshow)
      }
    },
    changepreviewshow({ commit, state }) {
      commit('CHANGE_PREVIEW_SHOW', !state.preview.prevshow)
    },
    set_previewimage({ commit }, { uploadfile, imgsrc }) {
      commit('SET_UPLOADFILE', uploadfile)
      commit('SET_PREVIEWIMAGE', imgsrc)
    },
    set_tobottombuttonshow({ commit, state }, isshow) {
      if (state.tobottombuttonshow !== isshow) {
        commit('SET_TOBOTTOMBUTTONSHOW', isshow)
      }
    },
    setreplayto({ commit }, replay) {
      commit('SET_REPLAYTO', replay)
    },
    setalert({ commit, state }, { isshow, alertMsg, status, lastingtime }) {
      if (status && status !== 'alert-gray') {
        commit('SET_ALERTSTATUS', status)
      } else {
        commit('SET_ALERTSTATUS', 'alert-gray')
      }
      commit('SET_ALERTMSG', alertMsg)
      if (!state.alert.isshow) {
        commit('SET_ALERTSHOW', isshow)
      }
      setTimeout(() => {
        commit('SET_ALERTSHOW', false)
      }, lastingtime);
    },
    setemojilistheight({ commit, state }, payload) {
      if (state.emojilistheight !== payload) {
        commit('SET_EMOJILISTHEIGHT', payload)
      }
    },
    setCurrentnode({ commit, state }, { prevNodeNum, textNum }) {
      if (state.currentNode.prevNodeNum !== prevNodeNum || state.currentNode.textNum !== textNum) {
        commit('SET_CURRENTNODE', { prevNodeNum, textNum })
      }
    }
  },
  getters: {
    getField,
    windowwidth(state) {
      return state.windowWidth
    },
    screenisphone(state) {
      return state.windowWidth < 640
    },
    emojipath(state) {
      let count = 0
      return state.right.emojilist.map(item => {
        const imgid = count++
        const image = require(`@/assets/emoji/${item}.svg`)
        const code = `#-EMOJI${item}EMOJI-#`
        return {
          imgid,
          image,
          code
        }
      })
    },
    activenavlist(state) {
      return state.left.userlist.listactivestatus
    },
    userlist(state) {
      // 如果沒發出訊息則不會顯示在最近。
      const userlistData = state.left.userlist.userlist.filter(item => !!item.msg)
      if (userlistData.length > 0) {
        // TODO:到時候要依照時間排序，還要考慮沒有送訊息時，沒有時間排序的問題
        // 有已讀和未讀的問題。到時候要加上。
        const sorData = userlistData.sort((prev, next) => {
          const earlytime = '1990-01-01T00:00:00'
          const prevdate = prev.msg && prev.msg.time && prev.msg.time !== '' ? Date.parse(prev.msg.time.replace(' ', 'T')) : Date.parse(earlytime)
          const nextdate = next.msg && next.msg.time && next.msg.time !== '' ? Date.parse(next.msg.time.replace(' ', 'T')) : Date.parse(earlytime)
          return nextdate - prevdate
        })
        let userrecentlist = []
        if (state.search === '') {
          userrecentlist = sorData
        } else {
          const regx = new RegExp(`${state.search}`)
          userrecentlist = sorData.filter(item => {
            return regx.test(item.username)
          })
        }
        if (userrecentlist.length > 0) {
          return userrecentlist.map(sitem => {
            if (sitem.msg && sitem.msg.msg) {
              const objArr = emojiConvert(sitem.msg.msg)
              const len = objArr.reduce((prev, next) => {
                const prevnum = prev.letterNum ? Number(prev.letterNum) : 0
                const nextnum = next.letterNum ? Number(next.letterNum) : 0
                return {
                  letterNum: prevnum + nextnum
                }
              })
              const limit = 10
              if (len <= limit) {
                sitem.msg.smsg = objArr
              } else {
                let count = 0
                let lastcount = 0
                let usedIndex = 0
                const lim = objArr.filter((item, index) => {
                  count += Number(item.letterNum)
                  if (count <= limit) {
                    lastcount = count
                    usedIndex = index + 1
                  }
                  return count <= limit
                })

                if (limit - lastcount > 0) {
                  const diff = limit - lastcount
                  objArr[usedIndex].obj = objArr[usedIndex].obj.slice(0, diff)
                  sitem.msg.smsg = [...lim, objArr[usedIndex]]
                } else {
                  sitem.msg.smsg = lim
                }
                // sitem.msg.smsg = [...objArr.map((_, index) => index <= limit), '...']
                // sitem.msg.smsg = objArr
              }
            }
            return sitem
          })
        } else {
          return []
        }
      } else {
        return []
      }
    },
    rightImage(state) {
      return state.mainImagesrc
    },
    selecteduserId(state) {
      return state.left.userlist.selecteduserid
    },
    selecteduserName(state) {
      if (state.left.userlist.selecteduserid === -1 || state.left.userlist.userlist.length === 0) {
        return ''
      } else {
        const userlist = state.left.userlist.userlist
        return userlist.find(item => {
          return item.userid === state.left.userlist.selecteduserid
        })['username']
      }
    },
    islvtop(state) {
      // 1:是總代，0；不是總代
      // 只有總代是沒有上級的，
      return state.personaldata.islvtop
    },
    usertype(state) {
      // 1 : 為代理 ， 0 : 不是代理
      return state.personaldata.usertype
    },
    customerserviceGroup(state) {
      const customserobj = state.left.userlist.userlist.find(item => {
        return item.isCustomerService === true
      })
      if (customserobj.msg && customserobj.msg.msg) {
        const objArr = emojiConvert(customserobj.msg.msg)
        const len = objArr.reduce((prev, next) => {
          const prevnum = prev.letterNum ? Number(prev.letterNum) : 0
          const nextnum = next.letterNum ? Number(next.letterNum) : 0
          return {
            letterNum: prevnum + nextnum
          }
        })
        const limit = 10
        if (len <= limit) {
          customserobj.msg.smsg = objArr
        } else {
          let count = 0
          let lastcount = 0
          let usedIndex = 0
          const lim = objArr.filter((item, index) => {
            count += Number(item.letterNum)
            if (count <= limit) {
              lastcount = count
              usedIndex = index + 1
            }
            return count <= limit
          })

          if (limit - lastcount > 0) {
            const diff = limit - lastcount
            objArr[usedIndex].obj = objArr[usedIndex].obj.slice(0, diff)
            customserobj.msg.smsg = [...lim, objArr[usedIndex]]
          } else {
            customserobj.msg.smsg = lim
          }
          // customserobj.msg.smsg = [...objArr.map((_, index) => index <= limit), '...']
        }
      }
      return customserobj
    },
    upLineList(state) {
      let uplist = []
      if (state.search === '') {
        uplist = state.left.userlist.userlist.filter(item => {
          return item.isParent === true && Number(state.personaldata.islvtop) !== 1
        })
      } else {
        const regx = new RegExp(`${state.search}`)
        uplist = state.left.userlist.userlist.filter(item => {
          return item.isParent === true && Number(state.personaldata.islvtop) !== 1 && regx.test(item.username)
        })
      }
      if (uplist.length > 0) {
        return uplist.map(sitem => {
          if (sitem.msg && sitem.msg.msg) {
            const objArr = emojiConvert(sitem.msg.msg)
            const len = objArr.reduce((prev, next) => {
              const prevnum = prev.letterNum ? Number(prev.letterNum) : 0
              const nextnum = next.letterNum ? Number(next.letterNum) : 0
              return {
                letterNum: prevnum + nextnum
              }
            })
            const limit = 10
            if (len <= limit) {
              sitem.msg.smsg = objArr
            } else {
              let count = 0
              let lastcount = 0
              let usedIndex = 0
              const lim = objArr.filter((item, index) => {
                count += Number(item.letterNum)
                if (count <= limit) {
                  lastcount = count
                  usedIndex = index + 1
                }
                return count <= limit
              })

              if (limit - lastcount > 0) {
                const diff = limit - lastcount
                objArr[usedIndex].obj = objArr[usedIndex].obj.slice(0, diff)
                sitem.msg.smsg = [...lim, objArr[usedIndex]]
              } else {
                sitem.msg.smsg = lim
              }
              // sitem.msg.smsg = [...objArr.map((_, index) => index <= limit), '...']
            }
          }
          return sitem
        })
      } else {
        return []
      }
    },
    underLineList(state) {
      let underlist = []
      if (state.search === '') {
        underlist = state.left.userlist.userlist.filter(item => {
          return !item.isParent && Number(state.personaldata.usertype) === 1 && !item.isCustomerService
        })
      } else {
        const regx = new RegExp(`${state.search}`)
        underlist = state.left.userlist.userlist.filter(item => {
          return !item.isParent && Number(state.personaldata.usertype) === 1 && !item.isCustomerService && regx.test(item.username)
        })
      }
      if (underlist.length > 0) {
        return underlist.map(sitem => {
          if (sitem.msg && sitem.msg.msg) {
            const objArr = emojiConvert(sitem.msg.msg)
            const len = objArr.reduce((prev, next) => {
              const prevnum = prev.letterNum ? Number(prev.letterNum) : 0
              const nextnum = next.letterNum ? Number(next.letterNum) : 0
              return {
                letterNum: prevnum + nextnum
              }
            })
            const limit = 10
            if (len <= limit) {
              sitem.msg.smsg = objArr
            } else {
              let count = 0
              let lastcount = 0
              let usedIndex = 0
              const lim = objArr.filter((item, index) => {
                count += Number(item.letterNum)
                if (count <= limit) {
                  lastcount = count
                  usedIndex = index + 1
                }
                return count <= limit
              })

              if (limit - lastcount > 0) {
                const diff = limit - lastcount
                objArr[usedIndex].obj = objArr[usedIndex].obj.slice(0, diff)
                sitem.msg.smsg = [...lim, objArr[usedIndex]]
              } else {
                sitem.msg.smsg = lim
              }
              // sitem.msg.smsg = [...objArr.map((_, index) => index <= limit), '...']
            }
          }
          return sitem
        })
      } else {
        return []
      }
    },
    chatcontent(state) {
      // 這裡考慮是否要做排序
      const regx = /(#-EMOJI\d{1,3}EMOJI-#)/g
      const newresult = state.right.chatlist.map(sitem => {
        const smsg = sitem.msg.split(regx)
          .filter(item => item !== '')
          .map((item, index) => {
            if (/#-EMOJI\d{1,3}EMOJI-#/g.test(item)) {
              const image = new Image()
              const num = item.replace(/#-EMOJI(\d{1,3})EMOJI-#/g, '$1')
              image.src = require(`@/assets/emoji/${num}.svg`)
              image.width = 20
              image.classList.add('inline-block')
              image.classList.add('select-none')
              return {
                key: `s_${index}`,
                obj: image.outerHTML
              }
            } else {
              const avoidXssString = item.replace(/</g, '&lt;').replace(/>/, '&gt;').replace(/"/g, '&quot;')
              return {
                key: `s_${index}`,
                obj: avoidXssString
              }
            }
          })
        sitem.smsg = smsg
        return sitem
      })
      return newresult
    },
    tmpemoji(state) {
      return state.tmpemoji
    },
    contentoffsettop(state) {
      return state.right.scrollcontent.contentoffsettop
    },
    contentheight(state) {
      return state.right.scrollcontent.contentheight
    },
    contentscrollheight(state) {
      return state.right.contentscrollheight
    },
    currentscrollposition(state) {
      return state.right.currentscrollposition
    },
    chatsizing(state) {
      return state.right.chatsizing
    },
    emojilistshow(state) {
      return state.emojilistshow
    },
    prevshow(state) {
      return state.preview.prevshow
    },
    previewimage(state) {
      return state.preview.imgsrc
    },
    previewuploadfile(state) {
      return state.preview.uploadfile
    },
    tobottombuttonshow(state) {
      return state.tobottombuttonshow
    },
    setreplaytodata(state) {
      const data = state.right.replytotext
      if (data.length >= 15) {
        return `${state.right.replytotext.substring(0, 15)}...`
      } else {
        return state.right.replytotext
      }
    },
    getalert(state) {
      return state.alert
    },
    getSendMsg(state) {
      return state.sendmsg
    },
    getemojiObject(state) {
      return state.emojiObjectformessage
    },
    emojiheight(state) {
      return state.emojilistheight
    },
    editablecurrentNode(state) {
      return state.currentNode
    }
  },
  modules: {
  }
})

const emojiConvert = (message) => {
  const regx = /(#-EMOJI\d{1,3}EMOJI-#)/g
  // 這裡要順便製作計算字數的動作
  return message.split(regx)
    .filter(item => item !== '')
    .map((item, index) => {
      if (/#-EMOJI\d{1,3}EMOJI-#/g.test(item)) {
        const image = new Image()
        const num = item.replace(/#-EMOJI(\d{1,3})EMOJI-#/g, '$1')
        image.src = require(`@/assets/emoji/${num}.svg`)
        image.width = 20
        image.classList.add('inline-block')
        image.classList.add('select-none')
        return {
          key: `s_${index}`,
          obj: image.outerHTML,
          letterNum: 1
        }
      } else {
        // const avoidXssString = item.replace(/</g, '&lt;').replace(/>/, '&gt;').replace(/"/g, '&quot;')
        const avoidXssString = item
        return {
          key: `s_${index}`,
          obj: avoidXssString,
          letterNum: item.length
        }
      }
    })
}