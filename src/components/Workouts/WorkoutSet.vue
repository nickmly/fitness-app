<template>
  <form @submit.prevent="$emit('addSet')">
    <input
      ref="weight"
      type="number"
      title="Weight"
      :value="weight"
      @input="$emit('addWeight', $event.target.value)"
      placeholder="Weight"
    />
    <input
      type="number"
      title="Reps"
      :value="reps"
      @input="$emit('addReps', $event.target.value)"
      placeholder="Reps"
    />
    <button type="submit">Done</button>
  </form>
</template>
<script>
export default {
  name: "WorkoutSet",
  props: ["weight", "reps"],
  mounted() {
    this.$refs.weight.focus();
  },
};
</script>