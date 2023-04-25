import artistService from "@/services/artist.services";
import albumService from "@/services/album.services";

const initialState = {
  artists: [],
  artist: {},
};

export const artists = {
  namespaced: true,
  state: initialState,
  actions: {
    getArtists({ commit }) {
      return artistService.getArtists().then((artists) => {
        commit("setArtists", artists);
      });
    },
    getArtist({ commit }, id) {
      return artistService.getArtist(id).then((artist) => {
        commit("setArtist", artist);
      });
    },
    createArtist({ commit }, artist) {
      return artistService
        .createArtist(artist)
        .then((artist) => commit("addArtist", artist));
    },
    updateArtist({ commit }, artist) {
      return artistService
        .updateArtist(artist)
        .then((artist) => commit("setArtist", artist));
    },
    uploadArtistImage({ commit }, artist) {
      return artistService
        .uploadArtistImage(artist)
        .then((artist) => commit("setArtistImage", artist));
    },
    deleteArtist({ commit }, id) {
      return artistService.deleteArtist(id);
    },
    getArtistGenres({ commit }, id) {
      return artistService
        .getArtistGenres(id)
        .then((genres) => commit("setArtistGenres", genres));
    },
    addArtistGenre({ commit }, { id, genreId }) {
      return artistService
        .addArtistGenre(id, genreId)
        .then((genre) => commit("addArtistGenre", genre));
    },
    removeArtistGenre({ commit }, { id, genreId }) {
      return artistService
        .removeArtistGenre(id, genreId)
        .then((genre) => commit("removeArtistGenre", genre));
    },
    getArtistAlbums({ commit }, id) {
      return artistService
        .getArtistAlbums(id)
        .then((albums) => commit("setArtistAlbums", albums));
    },
    createArtistAlbum({ commit }, album) {
      return albumService.createAlbum(album).then((album) => {
        commit("createArtistAlbum", album);
      });
    },
    updateArtistAlbum({ commit }, album) {
      return albumService.updateAlbum(album).then((album) => {
        commit("updateArtistAlbum", album);
      });
    },
    deleteArtistAlbum({ commit }, id) {
      return albumService.deleteAlbum(id).then(() => {
        commit("deleteArtistAlbum", id);
      });
    },
    updateArtistAlbumImage({ commit }, albumWithImage) {
      return albumService.uploadAlbumImage(albumWithImage).then((album) => {
        commit("updateAlbumImage", { ...albumWithImage, ...album });
      });
    },
    sendSummary({ commit }, email) {
      return artistService.sendSummary(email);
    },
    getArtistsWithAlbums({ commit }) {
      return artistService.getArtistWithAlbums().then((artists) => {
        commit("setArtists", artists);
      });
    },
  },
  mutations: {
    setArtists(state, artists) {
      state.artists = artists;
    },
    setArtist(state, artist) {
      state.artist = artist;
    },
    setArtistImage(state, artist) {
      state.artist.picture_url = artist.picture_url;
    },
    addArtist(state, artist) {
      state.artists.push(artist);
    },

    setArtistGenres(state, genres) {
      state.artist.genres = genres;
    },
    addArtistGenre(state, response) {
      state.artist.genres.push(response.genre);
    },
    removeArtistGenre(state, genre) {
      let index = -1;
      state.artist.genres.forEach((g) => {
        console.log(g.id, genre.genre_id);
        if (g.id == genre.genre_id) index = state.artist.genres.indexOf(g);
      });

      if (index != -1) {
        state.artist.genres.splice(index, 1);
      }
    },
    setArtistAlbums(state, albums) {
      state.artist.albums = albums;
    },
    createArtistAlbum(state, album) {
      if (state.artist.albums) {
        state.artist.albums.push(album);
      } else {
        state.artist.albums = [album];
      }
    },
    updateArtistAlbum(state, album) {
      let index = -1;
      state.artist.albums.forEach((a) => {
        if (a.id == album.id) index = state.artist.albums.indexOf(a);
      });
      state.artist.albums[index] = album;
    },
    deleteArtistAlbum(state, id) {
      let index = -1;
      state.artist.albums.forEach((a) => {
        if (a.id == id) index = state.artist.albums.indexOf(a);
      });
      state.artist.albums.splice(index, 1);
    },
    updateAlbumImage(state, album) {
      let index = -1;
      state.artist.albums.forEach((a) => {
        if (a.id == album.id) index = state.artist.albums.indexOf(a);
      });
      state.artist.albums[index].picture_url = album.picture_url;
    },
  },
  getters: {
    getArtists: (state) => {
      return state.artists;
    },
    getArtist: (state) => {
      return state.artist;
    },
  },
};
