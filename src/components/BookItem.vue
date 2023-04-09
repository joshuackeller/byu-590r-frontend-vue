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
      dueDate: "",
      checkedOutBook: false,
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
      this.$store
        .dispatch("books/checkoutBook", {
          bookId: this.book.id,
          due_date: this.dueDate,
        })
        .finally(() => {
          this.checkedOutBook = false;
        });
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
    <v-dialog v-model="checkedOutBook" width="auto">
      <v-card>
        <v-card-text>
          Are you sure you wish to check out this book?
        </v-card-text>
        <v-card-text>
          <input type="date" v-model="dueDate" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="checkedOutBook = false">No</v-btn>
          <v-btn color="green" @click="checkoutBook()" :disabled="!dueDate"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="book-item">
      <div class="d-flex justify-space-between">
        <v-btn
          @click="deleteDialog = true"
          class="bg-red pa-1 rounded-lg d-flex justify-center align-center"
          :disabled="book.checked_qty > 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="svg-size"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
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
        <v-btn @click="updateDialog = true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="svg-size"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </v-btn>
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
        <div
          class="font-weight-bold"
          v-if="book.inventory_total_qty <= book.checked_qty"
        >
          Out of Stock
        </div>
        <div class="font-weight-bold" v-else>
          Stock: {{ book.inventory_total_qty - book.checked_qty }} /
          {{ book.inventory_total_qty }}
        </div>
        <div class="d-flex justify-space-between">
          <v-btn
            :disabled="book.inventory_total_qty <= book.checked_qty"
            @click="checkedOutBook = true"
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
  padding: 20px;
}

.book-cover {
  margin: 20px auto 20px auto;

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
.svg-size {
  height: 20px;
  width: 20px;
}
</style>
