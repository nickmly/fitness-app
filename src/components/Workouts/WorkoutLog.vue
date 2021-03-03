<template>
  <div class="workout-log">
    <input
      class="date-picker"
      type="date"
      v-model="currentDate"
      v-if="!addingExercise"
    />
    <template v-if="!loading">
      <button v-if="currentDate && !addingExercise" @click="showExerciseList">Add Exercise</button>
      <ul class="workout-log__list" v-if="!addingExercise">
        <li v-for="exercise in workouts" :key="exercise.id">
          <app-workout-exercise
            :exercise="exercise"
            @deleteExercise="deleteExercise"
            @addSetToWorkout="addSetToWorkout"
            @deleteSetFromWorkout="deleteSetFromWorkout"
          />
        </li>
      </ul>
      <div class="workout-log__exercises" v-else>
        <button class="close-btn" @click="addingExercise = false" title="Close">
          <font-awesome-icon icon="times-circle" />
        </button>
        <app-exercise-list :exercises="exercises" @addExercise="addExercise" />
      </div>
    </template>
    <template v-else>
      <app-spinner />
    </template>
  </div>
</template>
<script>
import WorkoutExercise from "./WorkoutExercise";
import ExerciseList from "../Exercises/ExerciseList";
import Spinner from "../Spinner/Spinner";
import { HTTP } from "../../axios";

export default {
  components: {
    appSpinner: Spinner,
    appWorkoutExercise: WorkoutExercise,
    appExerciseList: ExerciseList,
  },
  data() {
    return {
      loading: true,
      log: {},
      workouts: [],
      addingExercise: false,
      currentDate: new Date().toISOString().split("T")[0],
    };
  },
  beforeMount() {
    HTTP.get("/exercises").then((response) => {
      this.$store.commit("setExercises", response.data);
      this.$store.commit(
        "setMuscles",
        new Set(this.exercises.map((e) => e.muscles))
      );
    });
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
  computed: {
    exercises() {
      return this.$store.state.exercises;
    },
  },
  methods: {
    resetLog() {
      this.loading = true;
      this.log = {};
      this.workouts = [];
      this.addingExercise = false;
    },
    async populateLog() {
      // Get the log for the current date
      const logResponse = await HTTP.get("/log", {
        params: {
          uid: this.$store.state.user.uid,
          date: this.currentDate,
        },
      });
      this.loading = false;
      this.log = logResponse.data.length === 0 ? null : logResponse.data[0];
      // If we have no log exit; No need to get the workouts from a non-existing log
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
    deleteExercise(id) {
      HTTP.delete("/workout", {
        params: {
          workout_id: id,
        },
      }).then(() => {
        this.workouts = this.workouts.filter((w) => w.workout_id !== id);
      });
      HTTP.delete("/sets", {
        params: {
          workout_id: id,
        },
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
    deleteSetFromWorkout(set) {
      HTTP.delete("/set", {
        params: {
          id: set.id,
        },
      }).then(() => {
        const workout = this.workouts.find(
          (w) => w.workout_id === set.workout_id
        );
        workout.sets = workout.sets.filter((s) => s.id !== set.id);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.date-picker {
  border: none;
  align-self: flex-end;
  font-size: 24px;
}

.workout-log {
  display: flex;
  flex-direction: column;
  margin: 0;
  background: $dark-grey;
}

@media screen and (min-width: $large-screen) {
  .workout-log {
    margin: 20px 80px;
  }
}

@media screen and (min-width: $xl-screen) {
  .workout-log {
    margin: 20px 220px;
  }
}

.workout-log__list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 8px;
}

.workout-log__list > li {
  display: flex;
  width: 100%;
  margin: 8px;
}
.workout-log__exercises {
  display: flex;
  flex-direction: column;
  margin: 8px;
}

.close-btn {
  align-self: flex-end;
}
</style>
