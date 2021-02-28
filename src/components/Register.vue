<template>
  <div>
    <h2>Register</h2>
    <p v-if="error !== ''">{{ error }}</p>
    <form @submit.prevent="onFormSubmit">
      <input type="email" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
<script>
import auth from '../auth';
export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async onFormSubmit() {
      try {
        await auth.register(this.email, this.password);
        this.$router.replace({ name: "log" });
      } catch (err) {
         this.error = err.message;
      }
    },
  },
};
</script>