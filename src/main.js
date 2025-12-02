import { createApp } from 'vue'
import { createPinia } from 'pinia' // Importante
import App from './App.vue'
import router from './router'

import './assets/main.css' // (Opcional, si existe)

const app = createApp(App)

app.use(createPinia()) // Conectamos Pinia
app.use(router)        // Conectamos el Router

app.mount('#app')