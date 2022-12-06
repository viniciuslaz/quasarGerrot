import { createWebHistory, createRouter } from "vue-router";
import ListComponent from "../components/ListComponent.vue";
import Dashboard from "../components/Dashboard.vue";
import Users from "../components/Users.vue";

const routes = [
  {
    path: "/dashboard",
    name: "home",
    component: Dashboard,
  },
  {
    path: "/",
    name: "listar",
    component: ListComponent,
  },
  {
    path: "/users",
    name: "users",
    component: Users,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;