import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    exercises: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setExercises(state, exercises) {
      state.exercises = exercises;
    }
  }
});

export default store;