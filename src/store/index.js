import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api:'http://localhost:3000',
    socket:{}
  },
  mutations: {
    setVariable(state,payload){
      Vue.set(state,payload.variable,payload.data)
    }
  },
  actions: {},
  modules: {}
});
