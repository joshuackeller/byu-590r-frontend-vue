<script>
import { BASE_URL } from "@/services/env";
import { mapState } from "vuex";
import LoadingItem from "@/components/LoadingItem.vue";
import html2pdf from "html2pdf.js";
// import VueHtml2pdf from "vue-html2pdf";

export default {
  name: "ArtistsView",
  components: {
    LoadingItem,
    // VueHtml2pdf,
  },
  computed: {
    ...mapState({
      artists() {
        return this.$store.state.artists.artists;
      },
    }),
  },
  created() {
    // this.getArtists();
    this.getArtistsWithAlbums();
  },
  data() {
    return {
      BASE_URL: BASE_URL,
      loadingArtists: true,
      createArtistDialog: false,
      name: "",
      image: "",
      valid: false,
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length >= 1) || "Password must be more than 1 character",
      ],
      imageRules: [(i) => !!i || "Image is required"],
      loadingNewArtist: false,
      mesage: "",
      messageType: "",

      summaryMessage: "",
      summaryMessageType: "",
      openSendSummary: false,
      loadingSendSummary: false,
      email: "",
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  methods: {
    getArtists() {
      this.$store
        .dispatch("artists/getArtists")
        .then(() => (this.loadingArtists = false));
    },
    chooseImage(e) {
      this.image = e.target.files[0];
    },
    createNewArtist() {
      if (this.valid) {
        this.loadingNewArtist = true;
        this.$store
          .dispatch("artists/createArtist", {
            name: this.name,
            image: this.image,
          })
          .then(
            () => {
              this.createArtistDialog = false;
              this.name = "";
              this.image = "";
              this.loadingNewArtist = false;
            },
            (error) => {
              this.loadingNewArtist = false;
              this.messageType = "error";
              this.message = error.response.data.message || "500 Error";
            }
          );
      } else {
        this.messageType = "error";
        this.message = "Please fill out all required fields";
      }
    },
    sendSummary() {
      if (this.sendSummaryValid) {
        this.loadingSendSummary = true;
        this.$store.dispatch("artists/sendSummary", this.email).then(
          () => {
            this.summaryMessageType = "success";
            this.summaryMessage = "Summary sent successfully";
            this.email = "";
            this.openSendSummary = false;
            this.loadingSendSummary = false;
          },
          (error) => {
            this.summaryMessageType = "error";
            this.summaryMessage = error.response.data.message || "500 Error";
          }
        );
      } else {
        this.summaryMessageType = "error";
        this.summaryMessage = "Please fill out all required fields";
      }
    },
    getArtistsWithAlbums() {
      this.$store.dispatch("artists/getArtistsWithAlbums").then(() => {
        this.loadingArtists = false;
      });
    },
    // exportToPDF() {
    //   html2pdf.from(document.getElementById("data-for-pdf"));
    // },
    // generateReport() {
    //   this.$refs.html2Pdf.generatePdf();
    // },
    exportToPDF() {
      html2pdf(this.$refs.document, {
        margin: 1,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
      });
    },
  },
};
</script>
<template>
  <div class="d-flex justify-space-between">
    <h2>Artists</h2>

    <v-btn @click="createArtistDialog = true">New Artist +</v-btn>

    <v-dialog v-model="openSendSummary" width="500">
      <v-form v-model="sendSummaryValid">
        <v-card class="pa-5">
          <h2>Send Summary</h2>
          <v-text-field
            v-model="email"
            label="Email *"
            required
            :rules="emailRules"
          />
          <p style="font-size: 12px">* indicates a required field</p>
          <div class="d-flex justify-space-between">
            <v-btn @click="openSendSummary = false">Cancel</v-btn>
            <v-btn
              @click="sendSummary"
              color="green"
              :loading="loadingSendSummary"
              :disabled="loadingSendSummary || !sendSummaryValid"
              >Send Summary</v-btn
            >
          </div>
          <div class="pt-2">
            <v-alert :type="messageType" v-if="!!message">{{
              message
            }}</v-alert>
          </div>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
  <div v-if="loadingArtists" class="d-flex justify-center py-10">
    <LoadingItem />
  </div>
  <div v-else>
    <v-dialog v-model="createArtistDialog" width="800">
      <v-card class="pa-5">
        <v-form v-model="valid" lazy-validation>
          <h2>New Artist</h2>
          <v-text-field
            v-model="name"
            label="Name *"
            required
            :rules="nameRules"
          />
          <v-file-input
            @change="chooseImage"
            label="Image *"
            required
            :loading="loadingNewArtist"
            :disabled="loadingNewArtist"
            :rules="imageRules"
          ></v-file-input>
          <p style="font-size: 12px">* indicates a required field</p>
          <div class="d-flex justify-space-between">
            <v-btn @click="createArtistDialog = false">Cancel</v-btn>
            <v-btn
              @click="createNewArtist"
              color="green"
              :loading="loadingNewArtist"
              :disabled="loadingNewArtist || !valid"
              >Create New Artist</v-btn
            >
          </div>
          <div class="pt-2">
            <v-alert :type="messageType" v-if="!!message">{{
              message
            }}</v-alert>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
    <v-container>
      <v-row>
        <v-col
          v-for="artist in artists"
          :key="artist.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <router-link :to="'/artists/' + artist.id">
            <v-card>
              <v-img
                v-if="!!artist.picture_url"
                :src="artist.picture_url"
                height="200"
              ></v-img>
              <v-card-title>{{ artist.name }}</v-card-title>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
    <div class="pt-10">
      <h2>Download Data</h2>
      <div class="d-flex pt-5" style="gap: 10px">
        <v-btn @click="openSendSummary = true" color="blue"
          >Send Email Summary
        </v-btn>
        <v-btn :href="BASE_URL + 'albums/export'" color="green"
          >Export To CSV</v-btn
        >
        <v-btn @click="exportToPDF" color="primary"> Export To PDF </v-btn>
      </div>
    </div>
    <div style="opacity: 0">
      <div ref="document">
        <div v-for="artist in artists" :key="artist.id">
          <h2>{{ artist.name }}</h2>

          <div class="pt-3 pb-12" style="gap: 10px">
            <h3 class="ml-10">Albums</h3>
            <div v-for="album in artist.albums" :key="album.id" class="ml-10">
              <h5 class="pb-5" style="margin-bottom: -20px">
                {{ album.name }}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
