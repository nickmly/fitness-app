<template>
  <div class="exercise">
    <header>
      <h4>{{ exercise.title }}</h4>
      <button @click="showSetForm(exercise.workout_id)">+</button>
    </header>
    <ul v-if="addingSetId !== exercise.workout_id" class="set-list">
      <li v-for="(set, index) in exercise.sets" :key="index">
        {{ set.weight }}lbs / {{ set.reps }} reps
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
    appWorkoutSet: WorkoutSet
  },
  data() {
    return {
      addingSetId: null,
      addingSetWeight: null,
      addingSetReps: null
    };
  },
  props: {
    exercise: Object,
  },
  methods: {
    showSetForm(id) {
      this.addingSetId = id;
    },
    addSet(id) {
      this.$emit('addSetToWorkout', {
        workout_id: id,
        weight: this.addingSetWeight,
        reps: this.addingSetReps
      });
      this.addingSetId = null;
    },
  },
};
</script>
<style scoped>
.exercise {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  text-align: left;
}
.exercise h4 {
  display: inline-block;
  font-size: 24px;
}
.set-list {
  display: inline-block;
}
</style>