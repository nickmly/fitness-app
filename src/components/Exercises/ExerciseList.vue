<template>
  <div class="exercise-list">
    <template v-if="!creatingExercise">
      <button
        v-if="!currentMuscle && !searchExercise"
        @click="creatingExercise = true"
      >
        Create Exercise
      </button>
      <input
        v-if="!currentMuscle"
        type="text"
        placeholder="Search"
        v-model="searchExercise"
      />
      <div v-if="!currentMuscle && !searchExercise" class="exercise-list__list">
        <button
          v-for="muscle in muscles"
          :key="muscle"
          @click="currentMuscle = muscle"
        >
          {{ muscle }}
        </button>
      </div>
      <div v-else class="exercise-list__list">
        <button class="back-btn" v-if="currentMuscle" @click="goBack">
          <font-awesome-icon icon="arrow-alt-circle-left" />
          <span> Go Back </span>
        </button>
        <button
          v-for="exercise in exercisesFiltered"
          :key="exercise.id"
          @click="$emit('addExercise', exercise.id)"
        >
          {{ exercise.title }}
        </button>
      </div>
    </template>
    <template v-else>
      <app-exercise-form @goBack="creatingExercise = false" />
    </template>
  </div>
</template>
<script>
import ExerciseForm from "./ExerciseForm";
export default {
  components: {
    appExerciseForm: ExerciseForm,
  },
  props: {
    exercises: Array,
  },
  data() {
    return {
      muscles: this.$store.state.muscles,
      currentMuscle: null,
      searchExercise: "",
      creatingExercise: false,
    };
  },
  methods: {
    goBack() {
      this.currentMuscle = null;
      this.searchMuscle = "";
    },
  },
  computed: {
    exercisesFiltered() {
      return this.currentMuscle
        ? this.exercises.filter((e) => e.muscles === this.currentMuscle)
        : this.exercises.filter((e) =>
            e.title.toLowerCase().includes(this.searchExercise.toLowerCase())
          );
    },
  },
};
</script>
<style scoped>
.exercise-list {
  display: flex;
  flex-direction: column;
}
.exercise-list__list {
  display: flex;
  flex-direction: column;
}
.back-btn {
  align-self: flex-start;
}
</style>