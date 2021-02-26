import firebase from "firebase/app";
import "firebase/auth";

const authMixin = {
  data() {
    return {
      loggedIn: false,
    };
  },
  beforeMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.loggedIn = user !== null;
      this.$store.commit('setUser', user);
    });
  },
}

export default authMixin;