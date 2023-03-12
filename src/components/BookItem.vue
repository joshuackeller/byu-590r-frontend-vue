<script lang="ts">
export default {
  name: "BookItem",
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      updateDialog: false,
      name: "",
      description: "",
      inventory_total_qty: 1,
      image: undefined,
      deleteDialog: false,
    };
  },
  mounted() {
    (this.name = this.book.name),
      (this.description = this.book.description),
      (this.inventory_total_qty = this.book.inventory_total_qty);
  },
  methods: {
    chooseImage(e) {
      this.image = e.target.files[0];
    },
    deleteBook() {
      this.$store
        .dispatch("books/deleteBook", this.book.id)
        .then(() => (this.deleteDialog = false));
    },
    checkoutBook() {
      this.$store.dispatch("books/checkoutBook", this.book.id);
    },
    returnBook() {
      this.$store.dispatch("books/returnBook", this.book.id);
    },
    updateBook() {
      this.$store
        .dispatch("books/updateBook", {
          id: this.book.id,
          name: this.name,
          description: this.description,
          inventory_total_qty: this.inventory_total_qty,
          image: this.image,
        })
        .then(() => {
          this.updateDialog = false;
        });
    },
    onBookImageChange(e) {
      var image = e.target.files || e.dataTransfer.files;

      if (!image.length) return;
      this.$store.dispatch("books/updateBookImage", {
        image: image[0],
        bookId: this.book.id,
      });
    },
  },
};
</script>

<template>
  <v-card>
    <div class="book-item">
      <div class="d-flex justify-space-between">
        <v-btn @click="deleteDialog = true" color="red" class="text-xs pa-1">
          Delete
        </v-btn>
        <v-dialog v-model="deleteDialog" width="400">
          <v-card class="pa-5">
            <h2>Are you sure you want to delete this book?</h2>
            <div class="d-flex justify-space-between">
              <v-btn>Cancel</v-btn>
              <v-btn @click="deleteBook" color="red">Delete</v-btn>
            </div>
          </v-card>
        </v-dialog>
        <v-btn @click="updateDialog = true"> Update Book</v-btn>
        <v-dialog v-model="updateDialog" width="800">
          <v-card class="pa-5">
            <h2>Update Book</h2>
            <v-text-field
              v-model="name"
              type="text"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="description"
              type="text"
              label="Description"
              required
            ></v-text-field>
            <v-text-field
              v-model="inventory_total_qty"
              type="number"
              label="Inventory Total Quantity"
              required
            ></v-text-field>
            <v-img
              height="150"
              width="100"
              class="preview-image mb-2"
              v-if="book.book_cover_picture_url"
              :src="book.book_cover_picture_url"
              cover
            ></v-img>
            <v-file-input
              @change="onBookImageChange"
              class=""
              label="File input"
              required
            ></v-file-input>
            <v-btn @click="updateBook" color="green"> Update Book</v-btn>
          </v-card></v-dialog
        >
      </div>
      <div class="book-cover">
        <img :src="book.book_cover_picture_url" alt="Book Cover" />
      </div>
      <div class="book-details">
        <h3>{{ book.name }}</h3>
        <p class="text-truncate text-sm-body-2">{{ book.description }}</p>
        <div v-if="book.inventory_total_qty <= book.checked_qty">
          Out of Stock
        </div>
        <div class="d-flex justify-space-between">
          <v-btn
            :disabled="book.inventory_total_qty <= book.checked_qty"
            @click="checkoutBook"
            color="green"
          >
            Checkout
          </v-btn>

          <v-btn :disabled="book.checked_qty == 0" @click="returnBook">
            Return
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.book-item {
  padding: 10px;
}

.book-cover {
  margin-left: auto;
  margin-right: auto;
  height: 150px;
  width: 100px;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.book-details {
  flex: 1;
}
.text-xs {
  font-size: 10px;
}
.preview-image {
  object-fit: contain;
  padding: 10px 0px 10px 0px;
}
</style>
