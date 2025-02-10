import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from "@primevue/themes/aura"

import { Button, InputText} from 'primevue'
import IftaLabel from 'primevue/iftalabel';


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})
app.component('Button', Button)
app.component('InputText', InputText)
app.component('IftaLabel', IftaLabel)

app.mount('#app')
