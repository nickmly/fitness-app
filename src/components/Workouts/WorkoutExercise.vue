<template>
  <div class="exercise">
    <header class="exercise-header">
      <h4>{{ exercise.title }}</h4>
      <div class="exercise-buttons">
        <button @click="showSetForm(exercise.workout_id)">+</button>
        <button @click="deleteExercise(exercise.workout_id)">X</button>
      </div>
    </header>
    <ul v-if="addingSetId !== exercise.workout_id" class="set-list">
      <li class="exercise-set" v-for="(set, index) in exercise.sets" :key="index">
        <span>{{ set.weight }}lbs / {{ set.reps }} reps</span>
        <button @click="deleteSet(set.id, exercise.workout_id)">X</button>
      </li>
    </ul>
    <app-workout-set
      v-else
      @addSet="addSet(exercise.workout_id)"
      @addWeight="addingSetWeight = $event"
      @addReps="addingSetReps = $event"
    />
  </div>
</template>
<script>
import WorkoutSet from "./WorkoutSet";
export default {
  components: {
    appWorkoutSet: WorkoutSet,
  },
  data() {
    return {
      addingSetId: null,
      addingSetWeight: null,
      addingSetReps: null,
    };
  },
  props: {
    exercise: Object,
  },
  methods: {
    showSetForm(id) {
      this.addingSetId = id;
    },
    deleteExercise(id) {
      this.$emit("deleteExercise", id);
    },
    addSet(id) {
      this.$emit("addSetToWorkout", {
        workout_id: id,
        weight: this.addingSetWeight,
        reps: this.addingSetReps,
      });
      this.addingSetId = null;
    },
    deleteSet(id, workout_id) {
      this.$emit("deleteSetFromWorkout", {
        id,
        workout_id,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.exercise {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  text-align: left;
  margin: 8px;
}
.exercise-header {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  border-bottom: 2px solid $white;
}
.exercise h4 {
  display: inline-block;
  font-size: 24px;
  max-width: 256px;
  margin: 0;
}
.set-list {
  display: inline-block;
}
.exercise-set {
  display: flex;
  justify-content: space-between;
}
</style>