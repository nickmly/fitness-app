<template>
  <div>
    <h2>Workout log</h2>
    <ul v-if="!addingExercise">
      <button @click="showExerciseList">Add</button>
      <li v-for="exercise in log" :key="exercise.id">
        <div class="exercise">
          <div>
            <h4>{{ exercise.title }}</h4>
            <button @click="showSetForm(exercise.id)">+</button>
          </div>
          <ul v-if="addingSet !== exercise.id" class="set-list">
            <li v-for="(set, index) in exercise.sets" :key="index">
              {{ set.weight }}lbs / {{ set.reps }} reps
            </li>
          </ul>
          <form v-else @submit.prevent="addSet(exercise.id)">
            <input
              type="number"
              v-model.number="addingSetWeight"
              placeholder="Weight"
            />
            <input
              type="number"
              v-model.number="addingSetReps"
              placeholder="Reps"
            />
            <button type="submit">Done</button>
          </form>
        </div>
      </li>
    </ul>
    <ul v-else>
      <button
        v-for="exercise in exercises"
        :key="exercise.id"
        @click="addExercise(exercise.id)"
      >
        {{ exercise.title }}
      </button>
    </ul>
  </div>
</template>
<script>
import { HTTP } from "../../axios";

export default {
  data() {
    return {
      exercises: this.$store.state.exercises,
      log: [],
      addingExercise: false,
      addingSet: null,
      addingSetWeight: null,
      addingSetReps: null,
      currentId: 0,
    };
  },
  mounted() {
    HTTP.get("/log", {
      params: {
        uid: this.$store.state.user.uid,
        date: new Date().toLocaleDateString(),
      },
    }).then((response) => {
      this.log = response.data;
    });
  },
  methods: {
    showExerciseList() {
      if (this.log.length === 0) {
        // if there is no log for today then add one
        HTTP
          .post("/log", {
            uid: this.$store.state.user.uid,
            date: new Date().toLocaleDateString(),
          })
          .then(() => {
            this.addingExercise = true;
          });
      } else {
        this.addingExercise = true;
      }
    },
    showSetForm(id) {
      this.addingSet = id;
    },
    addExercise(id) {
      const exercise = this.exercises.find((e) => e.id === id);
      this.log.push({
        id: this.currentId,
        title: exercise.title,
        sets: [],
      });
      this.currentId++;
      this.addingExercise = false;
    },
    addSet(id) {
      const exercise = this.log.find((e) => e.id === id);
      exercise.sets.push({
        weight: this.addingSetWeight,
        reps: this.addingSetReps,
      });
      this.addingSet = false;
    },
  },
};
</script>
<style scoped>
ul {
  list-style: none;
  padding: 0;
}
.exercise {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.exercise h4 {
  display: inline-block;
}
.set-list {
  display: inline-block;
}
</style>
