import firebase from "firebase/app";
import "firebase/auth";

const authMixin = {
  data() {
    return {
      loggedIn: false,
    };
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.loggedIn = user !== null;
    });
  },
}

export default authMixin;