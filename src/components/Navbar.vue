<template>
  <nav>
    <div>
      <router-link title="Home" to="/">
        <font-awesome-icon icon="dumbbell" />
      </router-link>
      <router-link v-if="loggedIn" to="/log">Log</router-link>
    </div>
    <div>
      <router-link v-if="!loggedIn" to="/login">Login</router-link>
      <router-link v-if="!loggedIn" to="/register">Register</router-link>
      <div v-if="loggedIn">
        <button @click="logOut">Log out</button>
      </div>
    </div>
  </nav>
</template>
<script>
import firebase from "firebase/app";
import "firebase/auth";

import auth from "../mixins/auth";

export default {
  mixins: [auth],
  methods: {
    async logOut() {
      try {
        await firebase.auth().signOut();
        this.$router.replace({ name: "login" });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
nav {
  background: $medium-grey;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  height: 64px;
  padding: 8px;
}
nav a {
  margin: 0 5px;
}
</style>