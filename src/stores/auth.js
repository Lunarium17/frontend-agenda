import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
  }),
  actions: {
    async login(usuario, password) {
      try {
        const res = await axios.post('http://localhost/agenda-final/backend-api/api/auth/login.php', {
        // const res = await axios.post('/api/auth/login.php', {
          nombre_de_usuario: usuario,
          password: password
        });
        
        this.token = res.data.token;
        this.user = res.data.usuario_id;
        
        // Persistencia
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        
        router.push('/agenda');
      } catch (error) {
        alert('Error en login: ' + (error.response?.data?.message || 'Error servidor'));
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  }
});