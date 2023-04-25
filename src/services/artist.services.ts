import axios from "axios";
import API_URL from "./env";
import authHeader from "./auth-header";

class ArtistService {
  getArtists() {
    return axios
      .get(API_URL + "artists", {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  getArtist(id) {
    return axios
      .get(API_URL + `artists/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  createArtist(artist) {
    const formData = new FormData();
    formData.append("name", artist.name);
    if (artist.image) {
      formData.append("image", artist.image);
    }
    return axios
      .post(API_URL + "artists", formData, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  updateArtist(artist) {
    return axios
      .put(API_URL + `artists/${artist.id}`, artist, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  uploadArtistImage(artist) {
    const formData = new FormData();
    formData.append("image", artist.image);
    return axios
      .post(API_URL + `artists/${artist.id}/update_image`, formData, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }
  removeArtistImage(id) {
    return axios
      .delete(API_URL + `artists/${id}/remove_image`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  deleteArtist(id) {
    console.log(3);
    return axios.delete(API_URL + `artists/${id}`, {
      headers: authHeader(),
    });
  }

  getArtistGenres(id) {
    return axios
      .get(API_URL + `artists/${id}/genres`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  addArtistGenre(id, genreId) {
    return axios

      .post(
        API_URL + `artists/${id}/genres/${genreId}`,
        {},
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        return response.data.data;
      });
  }

  removeArtistGenre(id, genreId) {
    return axios
      .delete(API_URL + `artists/${id}/genres/${genreId}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  getArtistAlbums(id) {
    return axios
      .get(API_URL + `artists/${id}/albums`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  sendSummary(email) {
    return axios
      .post(
        API_URL + `artists/summary`,
        { email },
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        return response.data.data;
      });
  }

  getArtistWithAlbums() {
    return axios
      .get(API_URL + `artists/all/withAlbums`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }
}

const artistService = new ArtistService();
export default artistService;
