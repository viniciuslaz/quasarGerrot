import { createApp } from 'vue'
import { Quasar } from 'quasar'
import Maska from 'maska'
import router from './router'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'


createApp(App).use(router).use(Maska).use(Quasar, {plugins: {},}).mount('#app')