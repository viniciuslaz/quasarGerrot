import { createWebHistory, createRouter } from "vue-router";
import ListComponent from "../components/ListComponent.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: ListComponent,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;