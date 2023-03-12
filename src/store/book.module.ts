import bookService from "@/services/book.service";

const initialState = {
  books: [],
};

export const books = {
  namespaced: true,
  state: initialState,
  actions: {
    getBooks({ commit }) {
      return bookService.getBooks().then(
        (books) => {
          commit("setBooks", books);
          return Promise.resolve(books);
        },
        (response) => {
          return Promise.resolve(response);
        }
      );
    },
    createBook({ commit }, book) {
      return bookService.createBook(book).then((response) => {
        commit("createBookSuccess", response.data.data);
      });
    },
    updateBook({ commit }, book) {
      return bookService.updateBook(book).then((response) => {
        commit("updateBookSuccess", response.data.data);
      });
    },
    updateBookImage({ commit }, { bookId, image }) {
      return bookService.updateBookImage({ bookId, image }).then((response) => {
        commit("updateBookImageSuccess", response.data.data);
      });
    },
    deleteBook({ commit }, bookId) {
      return bookService.deleteBook(bookId).then(() => {
        commit("deleteBookSuccess", bookId);
      });
    },
    checkoutBook({ commit }, bookId) {
      return bookService.checkoutBook(bookId).then(() => {
        commit("checkoutBookSuccess", bookId);
      });
    },
    returnBook({ commit }, bookId) {
      return bookService.returnBook(bookId).then(() => {
        commit("returnBookSuccess", bookId);
      });
    },
  },
  mutations: {
    setBooks(state, books) {
      state.books = books;
    },
    createBookSuccess(state, book) {
      state.books.push(book);
    },
    updateBookSuccess(state, book) {
      const index = state.books.findIndex(
        (stateBook) => stateBook.id == book.id
      );
      if (index != -1) state.books[index] = book;
    },
    deleteBookSuccess(state, bookId) {
      const index = state.books.findIndex(
        (stateBook) => stateBook.id == bookId
      );
      if (index != -1) state.books.splice(index, 1);
    },
    checkoutBookSuccess(state, bookId) {
      const index = state.books.findIndex(
        (stateBook) => stateBook.id == bookId
      );
      if (index != -1) state.books[index].checked_qty += 1;
    },
    returnBookSuccess(state, bookId) {
      const index = state.books.findIndex(
        (stateBook) => stateBook.id == bookId
      );
      if (index != -1) state.books[index].checked_qty -= 1;
    },
    updateBookImageSuccess(state, book) {
      console.log(book);
      const index = state.books.findIndex(
        (stateBook) => stateBook.id == book.id
      );
      console.log(index);
      if (index != -1)
        state.books[index].book_cover_picture_url = book.book_cover_picture_url;
    },
  },
  getters: {
    getBooks: (state) => {
      return state.books;
    },
    getBook: (state) => {
      return state.book;
    },
  },
};
