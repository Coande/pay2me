import Vue from 'vue'
import utils from '@/utils'
import App from './App.vue'

Vue.config.productionTip = false

// 把 utils 注册到全局
Vue.prototype.$utils = utils

new Vue({
  render: h => h(App),
}).$mount('#app')
