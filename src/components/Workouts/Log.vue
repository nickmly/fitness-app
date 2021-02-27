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
          <app-workout-set
            v-else
            @addSet="addSet(exercise.workout_id)"
            @addWeight="addingSetWeight = $event"
            @addReps="addingSetReps = $event"
          />
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
import WorkoutSet from "./WorkoutSet";
import Datepicker from "vuejs-datepicker";
import { HTTP } from "../../axios";

export default {
  components: {
    appWorkoutSet: WorkoutSet,
    appDatePicker: Datepicker,
  },
  data() {
    return {
      exercises: this.$store.state.exercises,
      log: {},
      workouts: [],
      addingExercise: false,
      addingSet: null,
      addingSetWeight: null,
      addingSetReps: null,
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
      this.addingSet = null;
      this.addingSetWeight = null;
      this.addingSetReps = null;
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
.date-picker {
  display: flex;
  justify-content: center;
}
</style>
