<template>
  <div id="app">
    <app-navbar />
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import { HTTP } from "./axios";

export default {
  name: "App",
  components: {
    appNavbar: Navbar,
  },
  mounted() {
    HTTP.get("/exercises").then((response) => {
      this.$store.commit("setExercises", response.data);
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
