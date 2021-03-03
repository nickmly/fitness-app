<template>
  <form @submit.prevent="$emit('addSet')">
    <input
      type="number"
      title="Weight"
      @input="$emit('addWeight', $event.target.value)"
      placeholder="Weight"
    />
    <input 
      type="number" 
      title="Reps"
      @input="$emit('addReps', $event.target.value)" 
      placeholder="Reps" 
    />
    <button type="submit">Done</button>
  </form>
</template>
<script>
export default {
  name: "WorkoutSet",
}
</script>