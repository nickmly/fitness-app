import firebase from "firebase/app";
import "firebase/auth";
import store from './store';

let auth = {};

auth.login = (email, password) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password).then(async () => {
      const token = await firebase.auth().currentUser.getIdToken();
      let authHeader = {
        Authorization: `Bearer ${token}`,
      };
      store.commit("setRequestHeader", authHeader);
    });
}

auth.register = (email, password) => {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password).then(async () => {
      const token = await firebase.auth().currentUser.getIdToken();
      let authHeader = {
        Authorization: `Bearer ${token}`,
      };
      store.commit("setRequestHeader", authHeader);
    });
}

export default auth;