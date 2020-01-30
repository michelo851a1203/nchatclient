import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://localhost:3000',
  vuex: {
    store,
    actionPrefix: 'socket_',
  }
}))

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
