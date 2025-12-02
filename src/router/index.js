import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Importamos las vistas
import LoginView from '../views/LoginView.vue'
import AgendaView from '../views/AgendaView.vue'
import RegistroView from '@/views/RegistroView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- ESTA ES LA LÍNEA QUE FALTABA ---
    { path: '/', redirect: '/login' }, 
    // ------------------------------------

    { path: '/login', component: LoginView },
    { path: '/registro', component: RegistroView },
    { path: '/perfil', component: () => import('../views/PerfilView.vue'), meta: { requiresAuth: true } },
    { path: '/agenda', component: AgendaView, meta: { requiresAuth: true } }
  ]
})

// Guardia de navegación (Protección de rutas)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Si la ruta requiere autorización y NO hay token...
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login'); // ...mandarlo al login
  } else {
    next(); // ...si no, dejarlo pasar
  }
});

export default router