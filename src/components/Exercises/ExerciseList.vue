<template>
  <div>
    <button
      v-for="exercise in exercises"
      :key="exercise.id"
      @click="$emit('addExercise', exercise.id)"
    >
      {{ exercise.title }}
    </button>
  </div>
</template>
<script>
export default {
  props: {
    exercises: Array
  }
}
</script>