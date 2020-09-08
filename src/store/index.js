import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api: "http://localhost:3000",
    socket: {},
    catálogo: [],
    comprobantes:[],
    alertDisplayTime:3000
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
        body: JSON.stringify({ tabla: payload.tabla }),
      })
        .then((json) => {
          return json.json();
        })
        .then((res) => {
          commit("setVariable", { variable: payload.variable, data: res });
        });
    },
  },
  getters: {
    cuentasDetalle: (state) => (param) => {
      if(!param){param=''}
      var result = state.catálogo.filter((cta) => {
        cta.fulltext=cta.cuenta.replace(/-/g,'')+" - "+cta.descripción
        var isDetalle = true
        var m = cta.cuenta.split("-")
        if(parseInt(m[m.length-1])==0){isDetalle=false}
        return (
          (cta.cuenta.replace(/-/g, "") + " " + cta.cuenta + " " + cta.descripción)
            .toLocaleLowerCase()
            .indexOf(param.toLocaleLowerCase()) >= 0   && isDetalle
        );
      });
      return result
    },
    filtro:(state=>params=>{
      return state[params.variable].filter(item=>{
        var cad=""
        Object.keys(item).forEach(k=>{
          cad+=item[k]+" "
        })
        return cad.trim().toLocaleLowerCase().indexOf(params.textBuscado.trim().toLocaleLowerCase())>=0
      })
    }),
    dlookup:(state)=>(param)=>{
      var result= state[param.tabla].filter(item=>{return item[param.campo]===param.texto})
      if(result.length>0){return result[0]}else{return {}}
    }
  },
  modules: {},
});
