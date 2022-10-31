import { createWebHistory, createRouter } from "vue-router";
import ListComponent from "../components/ListComponent.vue";
import Dashboard from "../components/Dashboard.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Dashboard,
  },
  {
    path: "/listar",
    name: "listar",
    component: ListComponent,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;