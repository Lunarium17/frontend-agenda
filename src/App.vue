<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* --- ESTILOS GLOBALES PARA TODA LA APP --- */

/* 1. Reseteamos márgenes y aseguramos altura completa en html y body */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f4f4; /* Un color de fondo base */
}

/* 2. Hacemos que el contenedor principal de Vue (#app) ocupe todo el espacio */
#app {
  width: 100%;
  min-height: 100vh; /* 100vh significa el 100% de la altura de la ventana */
  display: flex;
  flex-direction: column;
}

/* Opcional: hace que los inputs y botones se vean mejor en todos los navegadores */
*, *::before, *::after {
  box-sizing: border-box;
}
</style>