import Vue from 'vue';
import App from './App.vue';

import store from './store';
import router from './router';
import axios from 'axios';
import firebase from 'firebase/app';
import './icons';

Vue.prototype.$axios = axios;
Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_KEY,
  authDomain: "fitness-693ae.firebaseapp.com",
  databaseURL: "https://fitness-693ae-default-rtdb.firebaseio.com",
  projectId: "fitness-693ae",
  storageBucket: "fitness-693ae.appspot.com",
  messagingSenderId: "855905276111",
  appId: "1:855905276111:web:095ba4fdefc7016d9a27ba"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Ensure auth state changed fires before app is mounted
let app;
firebase.auth().onAuthStateChanged(async (user) => {
  store.commit('setUser', user);
  if (user) {
    const token = await firebase.auth().currentUser.getIdToken();
    let authHeader = {
      Authorization: `Bearer ${token}`
    };
    store.commit('setRequestHeader', authHeader);
  }
  
  if (!app) {
    app = new Vue({
      render: h => h(App),
      store,
      router
    }).$mount('#app')
  }
});

