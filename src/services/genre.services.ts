import axios from "axios";
import API_URL from "./env";
import authHeader from "./auth-header";

class GenreService {
  getGenres() {
    return axios
      .get(API_URL + "genres", {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  getGenre(id) {
    return axios
      .get(API_URL + `genres/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  createGenre(genre) {
    return axios
      .post(API_URL + "genres", genre, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  updateGenre(genre) {
    return axios
      .put(API_URL + `/genres/${genre.id}`, genre, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  deleteGenre(id) {
    return axios.delete(API_URL + `/genres/${id}`, {
      headers: authHeader(),
    });
  }

  getGenreArtists(id) {
    return axios
      .get(API_URL + `genres/${id}/artists`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }
}

const genreService = new GenreService();
export default genreService;
