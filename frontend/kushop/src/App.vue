<script setup>
import MainMenu from "./components/MainMenu.vue";

</script>

<template>
  <MainMenu></MainMenu>
  
  <!-- 🌟 เติม :key="$route.fullPath" ตรงนี้ -->
  <router-view :key="$route.fullPath"></router-view>
</template>

<style>
body {
  background-color: #090D16;
  color: #FFFFFF;
  margin: 0;
}
</style>
