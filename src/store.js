import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    exercises: [],
    muscles: [],
    requestHeader: null
  },
  mutations: {
    setRequestHeader(state, requestHeader) {
      state.requestHeader = requestHeader;
    },
    setUser(state, user) {
      state.user = user;
    },
    setExercises(state, exercises) {
      state.exercises = exercises;
    },
    setMuscles(state, muscles) {
      state.muscles = muscles;
    }
  },
  getters: {
    requestHeader: state => {
      return state.requestHeader;
    }
  }
});

export default store;