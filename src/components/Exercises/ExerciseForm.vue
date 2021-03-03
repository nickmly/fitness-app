<template>
  <div class="exercise-form">
    <button class="back-btn" @click="$emit('goBack')">
      <font-awesome-icon icon="arrow-alt-circle-left" />
      <span> Go Back </span>
    </button>
    <h2>Creating Custom Exercise</h2>
    <form @submit.prevent="createExercise">
      <input title="Name" type="text" placeholder="Name" v-model="title" />
      <select title="Muscle Targeted" v-model="muscles">
        <option
          v-for="muscleOpt in muscleOptions"
          :key="muscleOpt"
          :value="muscleOpt"
        >
          {{ muscleOpt }}
        </option>
      </select>
      <input title="Equipment Required" type="text" placeholder="Equipment Required" v-model="equipment" />
      <button>Create</button>
    </form>
  </div>
</template>
<script>
import { HTTP } from "../../axios";
export default {
  data() {
    return {
      muscleOptions: this.$store.state.muscles,
      title: null,
      muscles: "Quadriceps",
      equipment: null,
    };
  },
  methods: {
    createExercise() {
      HTTP.post("/exercises", {
        title: this.title,
        muscles: this.muscles,
        equipment: this.equipment,
      }).then(() => {
        // Refresh exercises
        HTTP.get("/exercises").then((response) => {
          this.$store.commit("setExercises", response.data);
          this.$emit("goBack");
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.exercise-form {
  display: flex;
  flex-direction: column;
}
.exercise-form > form {
  display: flex;
  flex-direction: column;
}
.back-btn {
  align-self: flex-start;
}
</style>