import firebase from "firebase/app";
import "firebase/auth";

let auth = {};

auth.login = (email, password) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
}

auth.register = (email, password) => {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
}

export default auth;