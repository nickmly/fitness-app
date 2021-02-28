<template>
  <app-login-form 
    title="Login" 
    :error="error"
    @onFormSubmit="onFormSubmit" 
    @changeEmail="email = $event"
    @changePassword="password = $event"
  />
</template>
<script>
import LoginForm from "./LoginForm";
import auth from "../../auth";
export default {
  components: {
    appLoginForm: LoginForm,
  },
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