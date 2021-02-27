<template>
  <div>
    <h2>Workout log</h2>
    <app-date-picker
      v-model="currentDate"
      wrapper-class="date-picker"
      format="yyyy-MM-dd"
    />
    <ul v-if="!addingExercise">
      <button @click="showExerciseList">Add</button>
      <li v-for="exercise in workouts" :key="exercise.id">
        <app-workout-exercise
          :exercise="exercise"
          @addSetToWorkout="addSetToWorkout"
        />
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
import WorkoutExercise from "./WorkoutExercise";
import Datepicker from "vuejs-datepicker";
import { HTTP } from "../../axios";

export default {
  components: {
    appWorkoutExercise: WorkoutExercise,
    appDatePicker: Datepicker,
  },
  data() {
    return {
      exercises: this.$store.state.exercises,
      log: {},
      workouts: [],
      addingExercise: false,
      currentDate: new Date(),
    };
  },
  async mounted() {
    await this.populateLog();
  },
  computed: {
    formattedDate() {
      return this.currentDate.toLocaleDateString();
    },
  },
  watch: {
    currentDate: function () {
      this.resetLog();
      this.populateLog();
    },
  },
  methods: {
    resetLog() {
      this.log = {};
      this.workouts = [];
      this.addingExercise = false;
    },
    async populateLog() {
      // Get the log for today
      const logResponse = await HTTP.get("/log", {
        params: {
          uid: this.$store.state.user.uid,
          date: this.formattedDate,
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
    showExerciseList() {
      if (this.log === null) {
        // if there is no log for today then add one
        HTTP.post("/log", {
          uid: this.$store.state.user.uid,
          date: this.formattedDate,
        }).then((response) => {
          this.log = {
            id: response.data,
            user_id: this.$store.state.user.uid,
            date: this.formattedDate,
          };
          this.addingExercise = true;
        });
      } else {
        this.addingExercise = true;
      }
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
    addSetToWorkout(set) {
      // Add a set to the DB with the workout id
      HTTP.post("/set", {
        workout_id: set.workout_id,
        weight: set.weight,
        reps: set.reps,
      }).then((response) => {
        const workout = this.workouts.find(
          (w) => w.workout_id === set.workout_id
        );
        workout.sets.push({
          id: response.data,
          weight: set.weight,
          reps: set.reps,
        });
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
.date-picker {
  display: flex;
  justify-content: center;
}
</style>
