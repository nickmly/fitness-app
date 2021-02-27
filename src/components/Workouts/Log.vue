<template>
  <div class="workout-log">
    <input class="date-picker" type="date" v-model="currentDate">
    <ul class="workout-log__list" v-if="!addingExercise">
      <button v-if="currentDate" @click="showExerciseList">Add Exercise</button>
      <li v-for="exercise in workouts" :key="exercise.id">
        <app-workout-exercise
          :exercise="exercise"
          @addSetToWorkout="addSetToWorkout"
        />
      </li>
    </ul>
    <div v-else>
      <button        
        v-for="exercise in exercises"
        :key="exercise.id"
        @click="addExercise(exercise.id)"
      >
        {{ exercise.title }}
      </button>
    </div>
  </div>
</template>
<script>
import WorkoutExercise from "./WorkoutExercise";
import { HTTP } from "../../axios";

export default {
  components: {
    appWorkoutExercise: WorkoutExercise,

  },
  data() {
    return {
      exercises: this.$store.state.exercises,
      log: {},
      workouts: [],
      addingExercise: false,
      currentDate: new Date().toLocaleDateString(),
    };
  },
  async mounted() {
    await this.populateLog();
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
          date: this.currentDate,
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
          date: this.currentDate,
        }).then((response) => {
          this.log = {
            id: response.data,
            user_id: this.$store.state.user.uid,
            date: this.currentDate,
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
.date-picker {
  border: none;
  align-self: flex-end;
  font-size: 24px;
}
.workout-log {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  background: #303844;
}
.workout-log__list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.workout-log__list > li {
  display: flex;
  width: 100%;
  margin: 8px;
}
</style>
