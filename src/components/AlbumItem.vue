<script>
export default {
  name: "AlbumItem",
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      confirmDelete: false,
      editAlbum: false,
      name: this.album.name,
      image: "",
      loadingChange: false,
      valid: false,
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length >= 1) || "Password must be more than 1 character",
      ],
      message: "",
      messageType: "",
      deleting: false,
    };
  },
  methods: {
    updateAlbum() {
      if (this.valid) {
        this.loadingChange = true;
        this.$store
          .dispatch("artists/updateArtistAlbum", {
            name: this.name,
            id: this.album.id,
          })
          .then(
            () => {
              this.editAlbum = false;
              this.loadingChange = false;
            },
            (error) => {
              this.message = error.response.data.message;
              this.messageType = "error";
              this.loadingChange = false;
            }
          );
      } else {
        this.message = "Please fill in all required fileds";
        this.messageType = "error";
      }
    },
    deleteAlbum() {
      this.deleting = true;
      this.$store.dispatch("artists/deleteArtistAlbum", this.album.id);
    },
    updateAlbumImage(e) {
      this.loadingChange = true;
      this.$store
        .dispatch("artists/updateArtistAlbumImage", {
          id: this.album.id,
          image: e.target.files[0],
        })
        .then(() => {
          this.loadingChange = false;
          //this.editAlbum = false;
        });
    },
  },
};
</script>
<template>
  <div>
    <v-img
      v-if="!!album.picture_url"
      :src="album.picture_url"
      height="150"
      class="mb-2"
    ></v-img>
    <h3 class="text-center pb-3">{{ album.name }}</h3>
    <div class="d-flex justify-space-around">
      <v-btn @click="editAlbum = true" class="mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="white"
          class="svg-style"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
          />
        </svg>
      </v-btn>
      <v-btn @click="confirmDelete = true" color="red">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="white"
          class="svg-style"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </v-btn>
    </div>
    <!-- Edit Dialog -->
    <v-dialog v-model="editAlbum" width="600">
      <v-form v-model="valid">
        <v-card class="pa-5">
          <h2>Edit Album</h2>
          <div>
            <v-text-field
              v-model="name"
              label="Album Name *"
              :rules="nameRules"
              class="mb-3"
            ></v-text-field>
            <v-file-input
              :loading="loadingChange"
              :disabled="loadingChange"
              @change="updateAlbumImage"
              label="Album Cover"
              class="mb-3"
            />
            <v-img :src="album.picture_url" height="150" />
            <p style="font-size: 12px">* indicates a required field</p>

            <div class="d-flex justify-space-between">
              <v-btn @click="editAlbum = false">Cancel</v-btn>
              <v-btn
                @click="updateAlbum"
                color="green"
                class="mr-3"
                :loading="loadingChange"
                :disabled="loadingChange || !valid"
              >
                Update Album
              </v-btn>
            </div>
            <div class="pt-2">
              <v-alert :type="messageType" v-if="!!message">{{
                message
              }}</v-alert>
            </div>
          </div>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="confirmDelete" width="400">
      <v-card class="pa-5">
        <h2>Are you sure you want to delete this album?</h2>
        <div class="d-flex justify-space-between mt-5">
          <v-btn @click="confirmDelete = false">Cancel</v-btn>
          <v-btn
            :loading="deleting"
            :disabled="deleting"
            @click="deleteAlbum"
            color="red"
            >Delete</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<style>
.svg-style {
  height: 15px;
  width: 15px;
}
</style>
