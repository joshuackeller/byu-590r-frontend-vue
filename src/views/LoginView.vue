<script lang="ts">
import router from "@/router";

export default {
  name: "LoginView",
  emits: ["authenticate"],

  data: () => ({
    valid: false,
    email: "",
    resetPasswordEmail: "",
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
    errorString: "",
    successMessage: "Login Success! Redirecting.",
    warningMessage: "Your email and password cannot be the same",
    errorMessage: "Login Failed! Cannot Authenticate!",
    isLoading: false,
    dialog: false,
    registerDialog: false,
    registerMessageType: undefined as
      | "success"
      | "error"
      | "warning"
      | "info"
      | undefined,
    registerMessageExists: false,
    registerMessage: "",
    registerSuccessMessage: "Registered Successfully! You can now login.",
    registerWarningMessage: "Your email and password cannot be the same",
    registerErrorMessage: "Registration failed. ",
    errorMsg: "",
    registerEmail: "",
    registerName: "",
    registerPassword: "",
    registerPasswordConfirmation: "",
    registerValid: false,
  }),
  methods: {
    submitLogin() {
      if (!this.valid) {
        return;
      }
      const user = {
        email: this.email,
        password: this.password,
      };
      this.errorMsg = "";
      this.isLoading = true;
      this.$store.dispatch("auth/login", user).then(
        async () => {
          this.errorString = this.successMessage;
          this.errorType = "success";
          this.messageExists = true;
          setTimeout(() => {
            window.location.replace("/");
          }, 2000);
        },
        (error) => {
          this.isLoading = false;
          this.errorString =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.errorType = "error";
          this.messageExists = true;
        }
      );
    },
    register() {
      if (!this.registerValid) {
        return;
      }
      if (this.registerPassword !== this.registerPasswordConfirmation) {
        this.registerMessage = "Passwords do not match";
        this.registerMessageType = "error";
        this.registerMessageExists = true;
        return;
      }
      if (this.registerEmail == this.password) {
        this.registerMessage = this.registerWarningMessage;
        this.registerMessageType = "warning";
        this.registerMessageExists = true;
        return;
      }
      const user = {
        name: this.registerName,
        email: this.registerEmail,
        password: this.registerPassword,
        c_password: this.registerPasswordConfirmation,
      };
      this.errorMsg = "";
      this.isLoading = true;
      this.$store.dispatch("auth/register", user).then(
        async () => {
          this.registerMessage = this.registerSuccessMessage;
          this.registerMessageType = "success";
          this.registerMessageExists = true;
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        (error) => {
          this.isLoading = false;
          this.registerMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.registerMessageType = "error";
          this.registerMessageExists = true;
        }
      );
    },
    forgotPassword() {
      if (!this.resetPasswordEmail) {
        return;
      }
      this.errorMsg = "";
      this.isLoading = true;
      this.$store.dispatch("auth/forgotPassword", this.resetPasswordEmail).then(
        async () => {
          this.dialog = false;
          this.errorString = "Reset password email sent successfully";
          this.errorType = "success";
          this.messageExists = true;
          await new Promise((resolve) => setTimeout(resolve, 2000));
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.errorString =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.errorType = "error";
          this.messageExists = true;
        }
      );
    },
  },
};
</script>

<template>
  <!-- Login Form -->
  <v-form ref="form" v-model="valid" lazy-validation>
    <div class="login-form">
      <div class="login-form-inner">
        <div>
          <h1 class="text-center">Welcome</h1>
        </div>
        <div>
          <v-text-field
            v-model="email"
            type="text"
            label="Email"
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
        <v-btn
          :loading="isLoading"
          :disabled="!valid"
          class="login-button w-full bg-green my-1"
          @click="submitLogin()"
          >Login</v-btn
        >
        <div class="login-buttons">
          <v-btn class="login-button" :disabled="dialog" @click="dialog = true"
            >Forgot Password</v-btn
          >
          <v-btn class="login-button" @click="registerDialog = true"
            >Register</v-btn
          >
        </div>
        <v-alert v-if="messageExists" outlined :type="errorType" prominent>
          {{ errorString }}
        </v-alert>
      </div>
    </div>
  </v-form>
  <!-- End Login Form -->

  <!-- Forgot Password Dialog -->
  <v-dialog v-model="dialog" width="400">
    <v-card>
      <div class="dialog">
        <h2>Reset Password</h2>
        <v-form>
          <v-text-field
            v-model="resetPasswordEmail"
            label="Password Reset Email"
            type="email"
          ></v-text-field>
        </v-form>
        <div class="dialog-buttons">
          <v-btn @click="dialog = false">Close</v-btn>
          <v-btn
            @click="forgotPassword()"
            :disabled="!resetPasswordEmail"
            class="btn-primary bg-green"
            >Submit</v-btn
          >
        </div>
      </div>
    </v-card>
  </v-dialog>
  <!-- End of Forgot Password Dialog -->

  <!-- Register Dialog -->
  <v-dialog v-model="registerDialog" width="500">
    <v-card>
      <div class="register-dialog">
        <h2>Register</h2>
        <v-form ref="form" v-model="registerValid" lazy-validation>
          <v-text-field
            v-model="registerName"
            label="Full Name"
            type="text"
            required
          ></v-text-field>
          <v-text-field
            v-model="registerEmail"
            label="Email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            v-model="registerPassword"
            :rules="passwordRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="registerPasswordConfirmation"
            :rules="passwordRules"
            label="Confirm Password"
            type="password"
            required
          ></v-text-field>
        </v-form>
        <div class="dialog-buttons">
          <v-btn @click="registerDialog = false">Close</v-btn>
          <v-btn @click="register()" class="btn-primary bg-green">Submit</v-btn>
        </div>
        <v-alert
          v-if="registerMessageExists"
          outlined
          :type="registerMessageType"
          prominent
          class="my-2"
        >
          {{ registerMessage }}
        </v-alert>
      </div>
    </v-card>
  </v-dialog>
  <!-- End of Register Dialog -->
</template>

<style lang="scss">
@use "@/assets/styles/ui.scss";
@use "@/assets/styles/loginvue.scss";
</style>
