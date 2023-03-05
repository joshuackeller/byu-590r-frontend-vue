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
  },
  mutations: {
    setBooks(state, books) {
      state.books = books;
    },
  },
  getters: {
    getBooks: (state) => {
      return state.books;
    },
  },
};
