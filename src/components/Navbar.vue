<template>
  <nav>
    <router-link to="/about">About</router-link>
    <router-link to="/exercises">Exercises</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
    <div v-if="loggedIn">
      <button @click="logOut">Log out</button>
    </div>
  </nav>
</template>
<script>
import firebase from "firebase/app";
import "firebase/auth";

import auth from '../mixins/auth';

export default {
  mixins: [auth],
  methods: {
    async logOut() {
      try {
        await firebase.auth().signOut();
        this.$router.replace({name: 'login'});
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style scoped>
nav a {
  margin: 0 5px;
}
</style>