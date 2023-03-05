<script lang="ts">
import { mapState } from "vuex";
export default {
  name: "BooksView",
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
  methods: {
    getBooks() {
      this.$store.dispatch("books/getBooks").then((response) => {
        this.$store.commit("books/setBooks", response);
      });
    },
  },
};
</script>
<template>
  <v-container>
    <h1>My Favorite Books</h1>
    <v-table theme="dark">
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
    </v-table>
  </v-container>
</template>
