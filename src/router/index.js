import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Catálogo from "../views/Catálogo.vue"
import ComprobanteDiario from "../views/ComprobanteDiario.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/catalogo",
    name: "Catálogo",
    component: Catálogo
  },
  {
    path: "/comprobantediario",
    name: "ComprobanteDiario",
    component: ComprobanteDiario
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
