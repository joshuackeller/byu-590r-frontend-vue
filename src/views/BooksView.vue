<script lang="ts">
import { mapState } from "vuex";
import BookItem from "../components/BookItem.vue";
export default {
  name: "BooksView",
  components: {
    BookItem,
  },
  computed: {
    ...mapState({
      books() {
        return this.$store.state.books.books;
      },
    }),
  },
  created() {
    this.getBooks();
  },
  data() {
    return {
      createBookDialog: false,
      name: "",
      description: "",
      inventory_total_qty: 1,
      image: undefined,
    };
  },
  methods: {
    getBooks() {
      this.$store.dispatch("books/getBooks").then((response) => {
        this.$store.commit("books/setBooks", response);
      });
    },
    createNewBook() {
      this.$store
        .dispatch("books/createBook", {
          name: this.name,
          description: this.description,
          inventory_total_qty: this.inventory_total_qty,
          image: this.image,
        })
        .then(() => {
          this.createBookDialog = false;
          this.name = "";
          this.description = "";
          this.inventory_total_qty = 1;
          this.image = undefined;
        });
    },
    chooseImage(e) {
      this.image = e.target.files[0];
    },
  },
};
</script>
<template>
  <v-container>
    <v-btn @click="createBookDialog = true" color="green"
      >Create New Book</v-btn
    >
    <v-dialog v-model="createBookDialog" width="800">
      <v-card class="pa-5">
        <h2>Create New Book</h2>
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
        <v-file-input
          @change="chooseImage"
          class=""
          label="File input"
          required
        ></v-file-input>
        <v-btn @click="createNewBook" color="green">Create Book </v-btn>
      </v-card>
    </v-dialog>
    <div class="grid rounded">
      <BookItem v-for="book in books" :key="book.id" :book="book" />
    </div>
    <!-- <v-table theme="dark">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Image</th>
          <th class="text-left">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.name }}</td>
          <td>
            <v-img :src="book.book_cover_picture_url" height="200"></v-img>
          </td>
          <td>{{ book.description }}</td>
        </tr>
      </tbody>
    </v-table> -->
  </v-container>
</template>
<style scoped>
.grid {
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 800px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1200px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1400px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
