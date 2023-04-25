import genreService from "@/services/genre.services";

const initialState = {
  genres: [],
};

export const genres = {
  namespaced: true,
  state: initialState,
  actions: {
    getGenres({ commit }) {
      return genreService.getGenres().then(
        (genres) => {
          commit("setGenres", genres);
          //return Promise.resolve(user);
        }
        // (response) => {
        //   return Promise.resolve(response);
        // }
      );
    },
  },
  mutations: {
    setGenres(state, genres) {
      state.genres = genres;
    },
  },
  getters: {
    getGenres: (state) => {
      return state.genres;
    },
  },
};
