<template>
  <div id="app">
    <app-navbar />
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    appNavbar: Navbar,
  },
};
</script>

<style lang="scss">
#app {
  font-family: $source-sans;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $white;
}
</style>
