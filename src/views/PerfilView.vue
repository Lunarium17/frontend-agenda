<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const usuarioInfo = ref({});
const cargando = ref(true);
const editando = ref(false);
const form = ref({ nombre_de_usuario: '', password: '' });

const obtenerPerfil = async () => {
  try {
    const response = await axios.get('http://localhost/agenda-final/backend-api/api/auth/perfil.php', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    usuarioInfo.value = response.data;
    form.value.nombre_de_usuario = usuarioInfo.value.nombre_de_usuario;
  } catch (error) { console.error(error); } finally { cargando.value = false; }
};

const actualizarPerfil = async () => {
  try {
    await axios.put('http://localhost/agenda-final/backend-api/api/auth/editar.php', form.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    alert("Perfil actualizado. Inicia sesión de nuevo.");
    authStore.logout();
  } catch (error) { alert("Error: " + (error.response?.data?.message || error.message)); }
};

onMounted(() => { obtenerPerfil(); });
</script>

<template>
  <div class="contenedor-centrado">
    <div class="card-estilo" style="max-width: 400px; width: 90%;">
      <h2 class="texto-centro">👤 Mi Perfil</h2>
      
      <div v-if="cargando" class="texto-centro">Cargando datos...</div>
      
      <div v-else>
        <div v-if="!editando">
          <div class="dato-item">
            <strong>Usuario:</strong> <span>{{ usuarioInfo.nombre_de_usuario }}</span>
          </div>
          <div class="dato-item">
            <strong>Desde:</strong> <span>{{ usuarioInfo.fecha_registro }}</span>
          </div>
          
          <button @click="editando = true" class="btn-actualizar ancho-completo mt-2" style="background-color: #f1c40f; padding: 10px;">✏️ Editar Perfil</button>
          <router-link to="/agenda" class="btn-guardar ancho-completo mt-2" style="display:block; text-align:center; text-decoration:none; padding: 10px; background-color: var(--color-primario);">⬅ Volver</router-link>
        </div>

        <form v-else @submit.prevent="actualizarPerfil">
          <label>Nuevo Nombre:</label>
          <input type="text" v-model="form.nombre_de_usuario" required />

          <label>Nueva Contraseña (Opcional):</label>
          <input type="password" v-model="form.password" placeholder="Dejar en blanco si no cambia" />

          <button type="submit" class="btn-guardar ancho-completo mt-2" style="padding: 10px;">💾 Guardar</button>
          <button type="button" @click="editando = false" class="btn-cancelar ancho-completo mt-2" style="padding: 10px;">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dato-item { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
.dato-item strong { display: block; color: var(--color-primario); }
label { font-weight: bold; display: block; margin-bottom: 5px; }
</style>