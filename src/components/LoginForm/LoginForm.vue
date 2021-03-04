<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <p v-if="error !== ''">{{ error }}</p>
    <form class="login-form" @submit.prevent="$emit('onFormSubmit')">
      <input ref="email" type="email" @input="$emit('changeEmail', $event.target.value)" placeholder="Email" />
      <input type="password" @input="$emit('changePassword', $event.target.value)" placeholder="Password" />
      <button type="submit">{{ title }}</button>
    </form>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    error: String
  },
  mounted() {
    this.$refs.email.focus();
  }
}
</script>
<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
}
</style>