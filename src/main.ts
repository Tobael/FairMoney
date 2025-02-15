import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'

import { Button, InputText, InputNumber, FloatLabel } from 'primevue'
import Panel from 'primevue/panel';
import IftaLabel from 'primevue/iftalabel'
import Select from 'primevue/select'
import AutoComplete from 'primevue/autocomplete'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import MultiSelect from 'primevue/multiselect';
import { definePreset } from '@primevue/themes'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const myTheme = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{lime.700}',
      100: '{lime.700}',
      200: '{lime.700}',
      300: '{lime.700}',
      400: '{lime.700}',
      500: '{lime.700}',
      600: '{lime.700}',
      700: '{lime.700}',
      800: '{lime.800}',
      900: '{lime.900}',
      950: '{lime.950}',
    },
  },
})

app.use(PrimeVue, {
  theme: {
    preset: myTheme,
  },
})
// eslint-disable-next-line vue/multi-word-component-names,vue/no-reserved-component-names
app.component('Button', Button)
app.component('FloatLabel', FloatLabel)
app.component('MultiSelect', MultiSelect)
app.component('Panel', Panel)
app.component('Select', Select)
app.component('InputNumber', InputNumber)
app.component('InputText', InputText)
app.component('IftaLabel', IftaLabel)
app.component('InputGroup', InputGroup)
app.component('AutoComplete', AutoComplete)
app.component('InputGroupAddon', InputGroupAddon)

app.mount('#app')
