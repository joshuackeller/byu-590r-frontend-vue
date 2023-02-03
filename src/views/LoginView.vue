<script lang="ts">
import router from "@/router";

export default {
  name: "LoginView",
  emits: ["authenticate"],

  data: () => ({
    valid: false,
    username: "",
    usernameRules: [(v: string) => !!v || "Name is required"],
    password: "",
    passwordRules: [
      (v: string) => !!v || "Password is required",
      (v: string) =>
        (v && v.length >= 10) || "Password must be more than 10 characters",
    ],
    isAuthenticated: false,
    errorType: undefined as
      | "success"
      | "error"
      | "warning"
      | "info"
      | undefined,
    messageExists: false,
    errorString: "undefined",
    successMessage: "Login Success! Redirecting.",
    warningMessage: "Your username and password cannot be the same",
    errorMessage: "Login Failed! Cannot Authenticate!",
    isLoading: false,
    dialog: false,
    email: "",
  }),
  methods: {
    async submitLogin() {
      this.isLoading = true;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(this.password);
      if (this.username == this.password) {
        this.errorString = this.warningMessage;
        this.errorType = "warning";
        this.messageExists = true;
      } else if (this.password === "testing123") {
        this.errorString = this.successMessage;
        this.errorType = "success";
        this.messageExists = true;
        this.isAuthenticated = true;
        this.$emit("authenticate", this.isAuthenticated);
        router.push("/");
      } else {
        this.errorString = this.errorMessage;
        this.errorType = "error";
        this.messageExists = true;
      }
      this.isLoading = false;
    },
  },
};
</script>

<template>
  <v-form ref="form" v-model="valid" lazy-validation class="mdi-box-shadow">
    <div class="login-form">
      <div class="login-form-inner">
        <div>
          <h1 class="text-center">Welcome</h1>
        </div>
        <div>
          <v-text-field
            v-model="username"
            :rules="usernameRules"
            type="text"
            label="Username"
            required
          ></v-text-field>
        </div>
        <div>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
        </div>
        <div class="login-buttons">
          <v-btn
            :loading="isLoading"
            :disabled="!valid"
            class="login-button bg-green"
            @click="submitLogin()"
            >Login</v-btn
          >

          <v-btn class="login-button" :disabled="dialog" @click="dialog = true"
            >Forgot Password</v-btn
          >
        </div>
        <v-alert v-if="messageExists" outlined :type="errorType" prominent>
          {{ errorString }}
        </v-alert>

        <!-- <v-alert outlined type="warning" prominent>
          Your username and password cannot be the same
        </v-alert>
        <v-alert outlined type="success" prominent>
          
        </v-alert> -->
      </div>
    </div>
  </v-form>
  <v-dialog v-model="dialog" width="400">
    <v-card>
      <div class="dialog">
        <v-form>
          <v-text-field
            v-model="email"
            label="Password Reset Email"
            type="email"
          ></v-text-field>
        </v-form>
        <div class="dialog-buttons">
          <v-btn @click="dialog = false">Close</v-btn>
          <v-btn class="btn-primary bg-green">Submit</v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
@use "@/assets/styles/ui.scss";
@use "@/assets/styles/loginvue.scss";
</style>
