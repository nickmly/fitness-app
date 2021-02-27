import Vue from 'vue'
import VueRouter from 'vue-router';

import About from './components/About.vue';
import Log from './components/Workouts/Log.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';

import firebase from "firebase/app";
import "firebase/auth";

Vue.use(VueRouter);

const redirectIfLoggedIn = (to, from, next) => {
    const isLoggedIn = firebase.auth().currentUser;
    if (isLoggedIn) {
        next('/exercises');
    } else {
        next();
    }
}

const routes = [
    { name: 'login', path: '/login', component: Login, beforeEnter: redirectIfLoggedIn },
    { name: 'register', path: '/register', component: Register, beforeEnter: redirectIfLoggedIn },
    { name: 'about', path: '/about', component: About },
    {
        name: 'exercises', path: '/exercises', component: Log, meta: {
            requiresAuth: true
        }
    }
];

const router = new VueRouter({ mode: 'history', base: process.env.BASE_URL, routes });
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isLoggedIn = firebase.auth().currentUser;
    if (requiresAuth && !isLoggedIn) {
        next('/login');
    } else {
        next();
    }
});

export default router;