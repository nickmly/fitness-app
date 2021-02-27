<template>
  <div>
    <h2>Workout log</h2>
    <ul v-if="!addingExercise">
      <button @click="showExerciseList">Add</button>
      <li v-for="exercise in workouts" :key="exercise.id">
        <div class="exercise">
          <div>
            <h4>{{ exercise.title }}</h4>
            <button @click="showSetForm(exercise.workout_id)">+</button>
          </div>
          <ul v-if="addingSet !== exercise.workout_id" class="set-list">
            <li v-for="(set, index) in exercise.sets" :key="index">
              {{ set.weight }}lbs / {{ set.reps }} reps
            </li>
          </ul>
          <form v-else @submit.prevent="addSet(exercise.workout_id)">
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
      log: {},
      workouts: [],
      addingExercise: false,
      addingSet: null,
      addingSetWeight: null,
      addingSetReps: null,
      currentId: 0,
    };
  },
  async mounted() {
    // Get the log for today
    const logResponse = await HTTP.get("/log", {
      params: {
        uid: this.$store.state.user.uid,
        date: new Date().toLocaleDateString(),
      },
    });
    this.log = logResponse.data.length === 0 ? null : logResponse.data[0];
    // If we have no log today, exit; No need to get the workouts from a non-existing log
    if (logResponse.data.length === 0) return;
    // Get the workouts from this log
    const workoutsResponse = await HTTP.get("/workout", {
      params: {
        log_id: this.log.id,
      },
    });
    // For each workout, get the exercise + all the sets associated and add to the workouts array
    workoutsResponse.data.forEach((w) => {
      const exercise = this.exercises.find(
        (e) => e.id === Number(w.exercise_id)
      );
      HTTP.get("/sets", {
        params: {
          workout_id: w.id,
        },
      }).then((response) => {
        this.workouts.push({
          id: w.exercise_id,
          title: exercise.title,
          workout_id: w.id,
          sets: response.data,
        });
      });
    });
  },
  methods: {
    showExerciseList() {
      if (this.log === null) {
        // if there is no log for today then add one
        HTTP.post("/log", {
          uid: this.$store.state.user.uid,
          date: new Date().toLocaleDateString(),
        }).then((response) => {
          this.log = {
            id: response.data,
            user_id: this.$store.state.user.uid,
            date: new Date().toLocaleDateString(),
          };
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
      const exercise = this.$store.state.exercises.find((e) => e.id === id);
      // Add a workout to the DB with the exercise id
      HTTP.post("/workout", {
        log_id: this.log.id,
        exercise_id: id,
      }).then((response) => {
        this.workouts.push({
          workout_id: response.data,
          id: exercise.id,
          title: exercise.title,
          sets: [],
        });
        this.addingExercise = false;
      });
    },
    addSet(id) {
      // Add a set to the DB with the workout id
      HTTP.post("/set", {
        workout_id: id,
        weight: this.addingSetWeight,
        reps: this.addingSetReps,
      }).then((response) => {
        const workout = this.workouts.find((w) => w.workout_id === id);
        workout.sets.push({
          id: response.data,
          weight: this.addingSetWeight,
          reps: this.addingSetReps,
        });
        this.addingSet = false;
      });
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
