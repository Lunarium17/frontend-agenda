<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const usuario = ref('');
const password = ref('');

const handleLogin = async () => {
  if(!usuario.value || !password.value) {
    alert("Por favor llena ambos campos");
    return;
  }
  await authStore.login(usuario.value, password.value);
};
</script>

<template>
  <div class="contenedor-centrado">
    
    <div class="card-estilo" style="max-width: 400px; width: 90%;">
      <h2 class="texto-centro">Iniciar Sesión</h2>
      
      <form @submit.prevent="handleLogin">
        <label>Usuario</label>
        <input type="text" v-model="usuario" placeholder="Tu usuario" />

        <label>Contraseña</label>
        <input type="password" v-model="password" placeholder="Tu contraseña" />

        <button type="submit" class="btn-guardar ancho-completo" style="padding: 12px;">Entrar</button>
      </form>
      
      <div class="mt-2 texto-centro">
        <p>¿No tienes cuenta? <router-link to="/registro" class="link">Regístrate aquí</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ¡Ya no necesitamos casi nada de CSS aquí! */
label { font-weight: bold; display: block; margin-bottom: 5px; color: #555; }
h2 { margin-bottom: 1.5rem; color: var(--color-primario); }
</style>