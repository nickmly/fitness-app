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
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&display=swap');
* {
  box-sizing: border-box;
}
body {
  background: $black;
}
a {
  color: $white;
  font-weight: bold;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
ul {
  list-style: none;
  padding: 0;
}
input {
  font-family: 'Source Sans Pro';
  background: $light-grey;
  padding: 10px;
  border: 2px solid $dark-blue;
  border-radius: 4px;
  font-size: 14px;
  margin: 8px;
}
input:active,
input:focus {
  border: 2px solid $light-blue;
  outline: none;
}
button {
  background: $dark-blue;
  color: $white;
  border: none;
  font-size: 14px;
  border-radius: 4px;
  padding: 10px;
  margin: 8px;
}
button:active, button:focus {
  background: $dark-blue;
  border: 2px solid $light-blue;
  padding: 8px;
}
button:hover {
  background: $light-blue;
}
#app {
  font-family: 'Source Sans Pro', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $white;
  margin-top: 60px;
}
</style>
