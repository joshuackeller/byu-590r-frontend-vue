<script>
import { mapState } from "vuex";
import LoadingItem from "../components/LoadingItem.vue";
import AlbumItem from "@/components/AlbumItem.vue";
import { all } from "axios";
export default {
  name: "ArtistView",
  components: {
    LoadingItem,
    AlbumItem,
  },
  computed: {
    ...mapState({
      artist() {
        return this.$store.state.artists.artist;
      },
      artistGenres() {
        return this.$store.state.artists.artist.genres;
      },
      newGenres() {
        const allGenres = this.$store.state.genres.genres;
        if (allGenres && allGenres?.length > 0) {
          const newGenres = allGenres?.filter(
            (genre) =>
              !this.artistGenres?.some(
                (artistGenre) => artistGenre.id === genre.id
              )
          );
          return newGenres;
        } else {
          return [];
        }
      },
      artistAlbums() {
        return this.$store.state.artists.artist.albums;
      },
    }),
  },
  created() {
    this.getArtist();
    this.getArtistGenres();
    this.getAllGenres();
    this.getArtistAlbums();
  },
  data() {
    return {
      loadingArtist: true,
      loadingArtistGenres: true,
      addGenreDiaglog: false,
      confirmDelete: false,

      newAlbumDialog: false,
      albumName: "",
      albumImage: "",
      creatingAlbum: false,
      albumNameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length >= 1) || "Password must be more than 1 character",
      ],
      albumImageRules: [(i) => !!i || "Image is required"],
      albumMessage: "",
      albumMessageType: "",
      newAlbumValid: false,

      loadingChange: false,
      editArtist: false,
      updateArtistValid: false,
      updateArtistMessage: "",
      updateArtistMessageType: "",
      name: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length >= 1) || "Password must be more than 1 character",
      ],

      deleting: false,
    };
  },
  methods: {
    getArtist() {
      this.$store
        .dispatch("artists/getArtist", this.$route.params.id)
        .then(() => {
          this.loadingArtist = false;
          this.name = this.artist.name;
        });
    },
    getArtistGenres() {
      this.$store
        .dispatch("artists/getArtistGenres", this.$route.params.id)
        .then(() => (this.loadingArtistGenres = false));
    },
    getAllGenres() {
      this.$store.dispatch("genres/getGenres");
    },
    addGenre(genreId) {
      this.$store.dispatch("artists/addArtistGenre", {
        id: this.$route.params.id,
        genreId: genreId,
      });
      this.addGenreDiaglog = false;
    },
    removeGenre(genreId) {
      this.$store.dispatch("artists/removeArtistGenre", {
        id: this.$route.params.id,
        genreId: genreId,
      });
    },
    deleteArtist() {
      this.deleting = true;
      this.$store.dispatch("artists/deleteArtist", this.$route.params.id);
      this.confirmDelete = false;
      this.$router.push({ name: "artists" });
    },
    updateArtist() {
      if (this.updateArtistValid) {
        this.loadingChange = true;
        this.$store
          .dispatch("artists/updateArtist", {
            id: this.$route.params.id,
            name: this.name,
          })
          .then(
            () => {
              this.editArtist = false;
              this.loadingChange = false;
            },
            (error) => {
              this.loadingNewArtist = false;
              this.messageType = "error";
              this.message = error.response.data.message || "500 Error";
            }
          );
      } else {
        this.updateArtistMessageType = "error";
        this.updateArtistMessage = "Please fill all required fields";
      }
    },
    updateImage(e) {
      this.loadingChange = true;
      this.$store
        .dispatch("artists/uploadArtistImage", {
          id: this.$route.params.id,
          image: e.target.files[0],
        })
        .then(() => (this.loadingChange = false));
    },
    getArtistAlbums() {
      this.$store.dispatch("artists/getArtistAlbums", this.$route.params.id);
    },
    createNewAlbum() {
      if (this.newAlbumValid) {
        this.creatingAlbum = true;
        this.$store
          .dispatch("artists/createArtistAlbum", {
            name: this.albumName,
            artist_id: this.$route.params.id,
            image: this.albumImage,
          })
          .then(
            () => {
              this.creatingAlbum = false;
              this.newAlbumDialog = false;
              this.albumImage = "";
              this.albumName = "";
            },
            (error) => {
              this.creatingAlbum = false;
              this.albumMessageType = "error";
              this.albumMessage = error.response.data.message || "500 Error";
            }
          );
      } else {
        this.albumMessageType = "error";
        this.albumMessage = "Please fill all required fields";
      }
    },
    onChangeAlbumImage(e) {
      this.albumImage = e.target.files[0];
    },
  },
};
</script>
<template>
  <div
    v-if="loadingArtist || loadingArtistGenres"
    class="d-flex justify-center py-10"
  >
    <LoadingItem />
  </div>
  <div v-else>
    <div class="pa-5">
      <div class="d-flex justify-space-between">
        <h1>{{ artist.name }}</h1>
        <div class="d-flex" style="gap: 10px">
          <v-btn @click="editArtist = true">Edit</v-btn>
          <v-btn @click="confirmDelete = true" color="red">Delete</v-btn>
        </div>
        <v-dialog v-model="editArtist" width="700">
          <v-form v-model="updateArtistValid" lazy-validation>
            <v-card class="pa-5">
              <h2 class="mb-5">Edit Artist</h2>
              <v-text-field
                v-model="name"
                label="Name *"
                required
                :rules="nameRules"
              ></v-text-field>
              <v-file-input
                label="Image"
                accept="image/*"
                @change="updateImage"
                :loading="loadingChange"
                :disabled="loadingChange"
              />
              <v-img
                v-if="!!artist.picture_url"
                :src="artist.picture_url"
                height="200"
                class="mb-2"
              ></v-img>
              <p style="font-size: 12px">* indicates a required field</p>
              <div class="d-flex justify-space-between">
                <v-btn @click="editArtist = false">Cancel</v-btn>
                <v-btn
                  @click="updateArtist"
                  :loading="loadingChange"
                  :disabled="loadingChange || !updateArtistValid"
                  color="green"
                  >Update</v-btn
                >
              </div>
              <div class="pt-2">
                <v-alert
                  :type="updateArtistMessageType"
                  v-if="!!updateArtistMessage"
                  >{{ updateArtistMessage }}</v-alert
                >
              </div>
            </v-card>
          </v-form>
        </v-dialog>
        <v-dialog v-model="confirmDelete" width="500">
          <v-card class="pa-5">
            <h2 class="mb-5">Are you sure you want to delete this artist?</h2>
            <div class="d-flex justify-space-between">
              <v-btn @click="confirmDelete = false">Cancel</v-btn>
              <v-btn
                @click="deleteArtist"
                :disabled="deleting"
                :loading="deleting"
                color="red"
                >Delete</v-btn
              >
            </div>
          </v-card>
        </v-dialog>
      </div>

      <v-img
        v-if="!!artist.picture_url"
        :src="artist.picture_url"
        height="200"
      ></v-img>
    </div>
    <div>
      <h2>Genres</h2>
      <div>
        <div class="pa-3">
          <v-row>
            <v-col v-for="genre in artistGenres" :key="genre.name" cols="auto">
              <div
                class="text-no-wrap pa-1 px-3 rounded position-relative"
                style="background-color: #242424; font-size: 14px"
              >
                {{ genre.name }}
                <div
                  @click="() => removeGenre(genre.id)"
                  class="position-absolute svg-position"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="svg-style"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </v-col>
            <v-col cols="auto">
              <button
                @click="addGenreDiaglog = true"
                class="text-no-wrap pa-1 rounded"
                style="
                  background-color: #242424;
                  color: #b0afaf;
                  font-size: 14px;
                "
              >
                Add Genre +
              </button>
            </v-col>
          </v-row>
        </div>
        <v-dialog v-model="addGenreDiaglog" width="800">
          <v-card class="pa-5">
            <h2>Add Genre</h2>
            <div v-if="newGenres?.length > 0" class="d-flex">
              <button
                v-for="genre in newGenres"
                :key="genre.name"
                class="pa-2 mx-2 rounded"
                style="background-color: #242424"
                @click="() => addGenre(genre.id)"
              >
                {{ genre.name }}
              </button>
            </div>
            <div v-else>No new genres to add</div>
          </v-card>
        </v-dialog>
      </div>
      <div></div>
    </div>
    <div class="mt-10">
      <div class="d-flex justify-space-between">
        <h2>Albums</h2>
        <div>
          <v-btn @click="newAlbumDialog = true" color="green"
            >New Album +
          </v-btn>
          <v-dialog v-model="newAlbumDialog" width="600">
            <v-form v-model="newAlbumValid" lazy-validation>
              <v-card class="pa-5">
                <h2>Create New Album</h2>
                <v-text-field
                  v-model="albumName"
                  label="Album Name *"
                  required
                  :rules="albumNameRules"
                />
                <v-file-input
                  @change="onChangeAlbumImage"
                  label="Album Cover *"
                  required
                  :rules="albumImageRules"
                >
                </v-file-input>
                <p style="font-size: 12px">* indicates a required field</p>
                <div class="d-flex justify-space-between">
                  <v-btn @click="newAlbumDialog = false">Cancel</v-btn>
                  <v-btn
                    @click="createNewAlbum"
                    color="green"
                    :loading="creatingAlbum"
                    :disabled="creatingAlbum || !newAlbumValid"
                    >Create New Album</v-btn
                  >
                </div>
                <div class="pt-2">
                  <v-alert :type="albumMessageType" v-if="!!albumMessage">{{
                    albumMessage
                  }}</v-alert>
                </div>
              </v-card>
            </v-form>
          </v-dialog>
        </div>
      </div>
      <v-container>
        <v-row>
          <v-col
            v-for="album in artistAlbums"
            :key="album.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <AlbumItem :album="album" />
          </v-col>
        </v-row>
      </v-container>
      <div v-if="artistAlbums?.length === 0" class="text-center py-10">
        No albums
      </div>
    </div>
  </div>
</template>

<style>
.svg-style {
  color: red;
  height: 12px;
  width: 12px;
}
.svg-position {
  top: -7px;
  right: -5px;
}
</style>
