<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <header>
    <h1>Legal Case Management</h1>

    <nav>
      <RouterLink to="/cases">Cases</RouterLink>
    </nav>
  </header>


  <RouterView />
</template>

<style scoped>
header {
   padding: 1rem 2rem;
   border-bottom: 1px solid #ccc;
}

header j1 {
  margin-bottom: 0.5rem;
}

new a{
  text-decoration: none;
}

</style>
