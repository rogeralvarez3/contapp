import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import swal from "vue-sweetalert2"
import 'sweetalert2/dist/sweetalert2.min.css'
import vMask from 'v-mask'

Vue.config.productionTip = false;
Vue.use(swal)
Vue.use(vMask)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
