import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api: "http://localhost:3000",
    socket: {},
    catálogo: [],
  },
  mutations: {
    setVariable(state, payload) {
      Vue.set(state, payload.variable, payload.data);
    },
  },
  actions: {
    getData({ state, commit }, payload) {
      fetch(`${state.api}/list`, {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tabla: payload }),
      })
        .then((json) => {
          return json.json();
        })
        .then((res) => {
          console.log(res)
          commit("setVariable", { variable: "catálogo", data: res });
        });
    },
  },
  getters: {
   
  },
  modules: {},
});
