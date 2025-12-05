<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const contactos = ref([]);
const cargando = ref(false);
const idEditar = ref(null);
const textoBusqueda = ref('');

const form = ref({
  nombre: '', apellido: '', telefono: '', email: '', direccion: '', notas: ''
});

// --- BUSCADOR MEJORADO (Nombre, Apellido O Teléfono) ---
const contactosFiltrados = computed(() => {
  return contactos.value.filter(contacto => {
    const texto = textoBusqueda.value.toLowerCase();
    
    // Unimos nombre y apellido
    const nombreCompleto = (contacto.nombre + ' ' + (contacto.apellido || '')).toLowerCase();
    
    // Obtenemos el teléfono
    const telefono = contacto.telefono;

    // Retorna TRUE si el texto está en el nombre O en el teléfono
    return nombreCompleto.includes(texto) || telefono.includes(texto);
  });
});

const listarContactos = async () => {
  cargando.value = true;
  try {
    // const response = await axios.get('http://localhost/agenda-final/backend-api/api/contactos/index.php', {
    const response = await axios.get('/api/contactos/index.php', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    contactos.value = response.data;
  } catch (error) {
    if(error.response?.status === 401) authStore.logout();
  } finally {
    cargando.value = false;
  }
};

// --- VALIDACIÓN DE TELÉFONO EN TIEMPO REAL ---
const validarTelefonoInput = (event) => {
  // Elimina cualquier caracter que NO sea número
  let valor = event.target.value.replace(/\D/g, '');
  // Corta a 10 dígitos si se pasa
  if (valor.length > 10) valor = valor.slice(0, 10);
  form.value.telefono = valor;
};

const procesarFormulario = async () => {
  // 1. Validar campos obligatorios
  if(!form.value.nombre || !form.value.telefono) {
    alert("Nombre y Teléfono son obligatorios");
    return;
  }

  // 2. VALIDACIÓN ESTRICTA DE 10 DÍGITOS
  if(form.value.telefono.length !== 10) {
    alert("El teléfono debe tener exactamente 10 dígitos.");
    return;
  }

  try {
    if(idEditar.value) {
      // await axios.put(`http://localhost/agenda-final/backend-api/api/contactos/actualizar.php?id=${idEditar.value}`, form.value, {
      await axios.put(`/api/contactos/actualizar.php?id=${idEditar.value}`, form.value, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      alert("Contacto actualizado");
    } else {
      // await axios.post('http://localhost/agenda-final/backend-api/api/contactos/crear.php', form.value, {
      await axios.post('/api/contactos/crear.php', form.value, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      alert("Contacto creado");
    }
    cancelarEdicion();
    await listarContactos();
  } catch (error) {
    alert("Error: " + (error.response?.data?.message || error.message));
  }
};

const cargarDatosParaEditar = (contacto) => {
  form.value = { ...contacto };
  idEditar.value = contacto.id;
};

const cancelarEdicion = () => {
  form.value = { nombre: '', apellido: '', telefono: '', email: '', direccion: '', notas: '' };
  idEditar.value = null;
};

const eliminar = async (id) => {
  if(!confirm("¿Estás seguro de eliminar este contacto?")) return;
  try {
    // await axios.delete(`http://localhost/agenda-final/backend-api/api/contactos/eliminar.php?id=${id}`, {
    await axios.delete(`/api/contactos/eliminar.php?id=${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    await listarContactos();
  } catch (error) {
    alert("No se pudo eliminar");
  }
};

onMounted(() => {
  listarContactos();
});
</script>

<template>
  <div class="dashboard">
    <header class="navbar">
      <h1>📒 Mi Agenda</h1>
      <div class="nav-actions">
        <router-link to="/perfil" class="btn-perfil">👤 Mi Perfil</router-link>
        <button @click="authStore.logout()" class="btn-logout">Cerrar Sesión</button>
      </div>
    </header>

    <div class="contenido-principal">
      <aside class="panel-form card-estilo">
        <h3>{{ idEditar ? 'Editar Contacto' : 'Nuevo Contacto' }}</h3>
        <form @submit.prevent="procesarFormulario">
          <input v-model="form.nombre" type="text" placeholder="Nombre (Obligatorio)" required />
          
          <input 
            :value="form.telefono" 
            @input="validarTelefonoInput" 
            type="text" 
            placeholder="Teléfono (10 dígitos)" 
            maxlength="10"
            required 
          />

          <input v-model="form.apellido" type="text" placeholder="Apellido" />
          <input v-model="form.email" type="email" placeholder="Correo Electrónico" />
          <input v-model="form.direccion" type="text" placeholder="Dirección física" />
          <textarea v-model="form.notas" placeholder="Notas..." rows="3"></textarea>
          
          <button type="submit" class="btn-full" :class="idEditar ? 'btn-actualizar' : 'btn-guardar'">
            {{ idEditar ? 'Actualizar' : 'Guardar' }}
          </button>
          <button v-if="idEditar" type="button" @click="cancelarEdicion" class="btn-cancelar btn-full mt-2">Cancelar</button>
        </form>
      </aside>

      <section class="panel-lista">
        <div class="header-lista">
          <h3>Mis Contactos ({{ contactos.length }})</h3>
          <input v-model="textoBusqueda" type="text" class="buscador" placeholder="🔍 Buscar nombre o teléfono..." />
        </div>
        
        <div v-if="cargando">Cargando...</div>
        
        <div v-else-if="contactosFiltrados.length === 0" class="vacio">
          <p>No se encontraron contactos.</p>
        </div>

        <div v-else class="grid-contactos">
          <div v-for="contacto in contactosFiltrados" :key="contacto.id" class="tarjeta card-estilo">
            <div class="info">
              <h4>{{ contacto.nombre }} {{ contacto.apellido }}</h4>
              <p>📞 {{ contacto.telefono }}</p>
              <p v-if="contacto.email">✉️ {{ contacto.email }}</p>
              <p v-if="contacto.direccion">📍 {{ contacto.direccion }}</p>
              <p v-if="contacto.notas" class="nota-texto">📝 {{ contacto.notas }}</p>
            </div>
            <div class="acciones">
              <button @click="cargarDatosParaEditar(contacto)" class="btn-editar">✏️</button>
              <button @click="eliminar(contacto.id)" class="btn-eliminar">🗑️</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Solo estilos de layout, el resto viene de main.css */
.dashboard { min-height: 100vh; }
.navbar { background-color: var(--color-primario); color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.nav-actions { display: flex; gap: 15px; align-items: center; }
.btn-perfil { color: white; text-decoration: none; font-weight: bold; }
.btn-logout { background: rgba(255,255,255,0.2); border: 1px solid white; color: white; padding: 5px 15px; border-radius: 5px; }
.contenido-principal { display: flex; padding: 2rem; gap: 2rem; max-width: 1200px; margin: 0 auto; }
.panel-form { flex: 1; height: fit-content; }
.btn-full { width: 100%; padding: 10px; border-radius: 5px; }
.mt-2 { margin-top: 10px; }
.panel-lista { flex: 2; }
.header-lista { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.buscador { padding: 10px; border: 1px solid #ddd; border-radius: 20px; width: 250px; }
.grid-contactos { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
.tarjeta { display: flex; justify-content: space-between; align-items: start; }
.info h4 { margin: 0 0 5px 0; color: var(--color-texto); }
.info p { margin: 2px 0; color: #666; font-size: 0.9rem; }
.nota-texto { font-style: italic; color: #888; margin-top: 5px; border-top: 1px dashed #eee; padding-top: 5px; }
.acciones { display: flex; gap: 5px; }
.btn-editar { background: #f1c40f; color: white; padding: 5px 8px; border-radius: 5px; }
.btn-eliminar { padding: 5px 8px; border-radius: 5px; }

@media (max-width: 768px) {
  .contenido-principal { flex-direction: column; }
  .header-lista { flex-direction: column; align-items: flex-start; gap: 10px; }
  .buscador { width: 100%; }
}
</style>