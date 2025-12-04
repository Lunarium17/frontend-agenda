<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const usuario = ref('');
const password = ref('');
const errorMsg = ref('');

const handleRegistro = async () => {
  errorMsg.value = '';
  if (!usuario.value || !password.value) {
    alert("Por favor llena ambos campos");
    return;
  }
  try {
    // await axios.post('http://localhost/agenda-final/backend-api/api/auth/registro.php', {
    await axios.post('/api/auth/registro.php', {
      nombre_de_usuario: usuario.value,
      password: password.value
    });
    alert("¡Usuario creado con éxito!");
    router.push('/login'); 
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Error al registrarse';
  }
};
</script>

<template>
  <div class="contenedor-centrado fondo-gradiente">
    
    <div class="card-estilo" style="max-width: 400px; width: 90%;">
      <h2 class="texto-centro">Crear Cuenta</h2>
      
      <form @submit.prevent="handleRegistro">
        <label>Nuevo Usuario</label>
        <input type="text" v-model="usuario" placeholder="Ej: nuevoUsuario" />

        <label>Nueva Contraseña</label>
        <input type="password" v-model="password" placeholder="******" />

        <p v-if="errorMsg" class="texto-error">{{ errorMsg }}</p>

        <button type="submit" class="btn-guardar ancho-completo" style="background-color: var(--color-primario); padding: 12px;">Registrarse</button>
      </form>
      
      <div class="mt-2 texto-centro">
        <p>¿Ya tienes cuenta? <router-link to="/login" class="link">Inicia sesión</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
label { font-weight: bold; display: block; margin-bottom: 5px; color: #555; }
h2 { margin-bottom: 1.5rem; color: var(--color-primario); }
</style>