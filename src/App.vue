<script>
import { RouterLink, RouterView } from "vue-router";
import LoginView from "./views/LoginView.vue";
import { mapState } from "vuex";
import { ref } from "vue";
export default {
  setup() {
    const theme = ref("dark");
    function changeTheme() {
      theme.value = theme.value === "light" ? "dark" : "light";
    }
    return { theme, changeTheme };
  },
  name: "App",
  components: {
    LoginView,
    // RouterLink,
    RouterView,
  },
  data: function () {
    return {
      profileDialog: false,
      profileIsUploading: false,
      verificationEmailLoading: false,
      showEmailNotVerifiedDialog: false,
      showChangeEmailTextField: false,
      changeEmail: false,
      successVerificationMessage: "",
      changeEmailRules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 3) || "Min 3 characters",
      ],
      profile: {
        avatar: "",
        name: "",
        title: "",
        icon: "mdi-account-circle",
        color: "info",
      },
      profilePictureImage: "",
      emailOfVerification: "",
    };
  },
  computed: {
    ...mapState({
      user() {
        return this.$store.state.user.user;
      },
      auth() {
        return this.$store.state.auth;
      },
      authUser() {
        return this.auth.user;
      },
      isAuthenticated() {
        return this.auth.status.loggedIn && this.authUser.token !== undefined;
      },
      title() {
        return "Welcome " + this.authUser.name + "!";
      },
      avatarURL() {
        return this.auth.user.avatar;
      },
    }),
  },
  updated() {
    if (this.isAuthenticated) {
      this.$router.push({ name: "home" });
    }
  },
  created() {
    if (this.authUser) {
      this.getCurrentUser();
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
    },
    checkAuth(auth) {
      console.log("Authenticated!", auth);
    },
    onAvatarChange(e) {
      var image = e.target.files || e.dataTransfer.files;

      if (!image.length) return;
      this.profileIsUploading = true;
      this.$store
        .dispatch("user/uploadAvatar", image[0], { root: true })
        .then((response) => {
          this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
          this.profileIsUploading = false;
        })
        .catch((error) => {
          console.log(error);
          alert("Error. Try again");
          this.profileIsUploading = false;
        });
    },
    removeAvatar() {
      this.profileIsUploading = true;
      this.$store
        .dispatch("user/removeAvatar")
        .then((response) => {
          this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
          this.profileIsUploading = false;
        })
        .catch((error) => {
          console.log(error);
          alert("Error. Try again");
          this.profileIsUploading = false;
        });
    },
    getCurrentUser() {
      this.profile.name = this.authUser.name;
      this.profile.title = this.title;
      this.$store.dispatch("user/getUser").then((response) => {
        if (response.avatar) {
          this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
        }
        if (!response.email_verified_at) {
          this.showEmailNotVerifiedDialog = true;
        }
      });
    },
  },
};
</script>
<template>
  <v-app :theme="theme">
    <v-app-bar
      :title="authUser.name === undefined ? '' : title"
      v-if="isAuthenticated"
    >
      <v-spacer></v-spacer>
      <!-- <v-btn to="/" default>Home</v-btn> -->
      <v-btn to="/artists">Artists</v-btn>
      <!-- <v-btn to="/about">About</v-btn> -->
      <v-btn to="/books">Books</v-btn>

      <div class="text-center">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props">
              <v-avatar color="info">
                <v-img
                  icon
                  v-bind="props"
                  v-if="avatarURL"
                  :src="avatarURL"
                  cover
                ></v-img>
                <v-icon
                  v-else
                  v-bind="props"
                  icon="mdi-account-circle"
                ></v-icon>
              </v-avatar>
            </v-btn>
          </template>

          <v-card class="pa-4" width="300">
            <div>
              <v-card-text class="text-center">{{ authUser.name }}</v-card-text>
              <v-divider></v-divider>
              <div className="d-flex mt-2">
                <v-btn
                  :prepend-icon="
                    theme === 'light'
                      ? 'mdi-weather-sunny'
                      : 'mdi-weather-night'
                  "
                  @click="changeTheme"
                  >Toggle Theme</v-btn
                >
                <v-btn @click="profileDialog = true"> Profile </v-btn>
              </div>
              <v-divider class="mt-2"></v-divider>
              <div class="d-flex justify-center mt-2">
                <v-btn class="text-center" @click="logout()">Logout</v-btn>
              </div>
            </div>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
    <v-dialog v-model="profileDialog">
      <v-card max-width="700" min-width="500" class="pa-4 mx-auto">
        <h2>Profile Avatar</h2>
        <v-img
          v-bind="props"
          v-if="avatarURL"
          :src="avatarURL"
          height="200"
          class="my-4"
          contain
        ></v-img>
        <v-icon
          v-else
          v-bind="props"
          icon="mdi-account-circle"
          color="blue"
          class="mx-auto my-4"
        ></v-icon>
        <v-file-input
          @change="onAvatarChange"
          :disabled="profileIsUploading"
          :loading="profileIsUploading"
          class=""
          label="File input"
        ></v-file-input>
        <v-divider></v-divider>
        <v-btn
          max-width="250px"
          @click="removeAvatar"
          class="mt-2"
          :disabled="profileIsUploading"
          :loading="profileIsUploading"
          >Remove Profile Avatar</v-btn
        >
      </v-card>
    </v-dialog>

    <v-main>
      <v-container>
        <div v-if="isAuthenticated">
          <RouterView />
        </div>
        <LoginView
          v-else
          :is-authenticated="isAuthenticated"
          @authenticate="checkAuth($event)"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
@use "@/assets/styles/app.scss";
</style>
