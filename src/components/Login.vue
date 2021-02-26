<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="onFormSubmit">
      <input type="email" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
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
        const user = await auth.login(this.email, this.password);
        console.log(user);
        this.$router.replace({name: 'exercises'});
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>