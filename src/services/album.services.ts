import axios from "axios";
import API_URL from "./env";
import authHeader from "./auth-header";

class AlbumService {
  getAlbums() {
    return axios
      .get(API_URL + "albums", {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  getAlbum(id) {
    return axios
      .get(API_URL + `albums/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  createAlbum(album) {
    const formData = new FormData();
    formData.append("name", album.name);
    formData.append("artist_id", album.artist_id);
    if (album.image) {
      formData.append("image", album.image);
    }
    return axios
      .post(API_URL + "albums", formData, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  updateAlbum(album) {
    return axios
      .put(API_URL + `albums/${album.id}`, album, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }

  uploadAlbumImage(album) {
    const formData = new FormData();
    formData.append("image", album.image);
    return axios
      .post(API_URL + `albums/${album.id}/update_image`, formData, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data.data;
      });
  }
  removeAlbumImage(id) {
    return axios
      .delete(API_URL + `albums/${id}/remove_image`, { headers: authHeader() })
      .then((response) => {
        return response.data.data;
      });
  }

  deleteAlbum(id) {
    return axios.delete(API_URL + `albums/${id}`, {
      headers: authHeader(),
    });
  }

  export() {
    return axios.post(
      API_URL + `albums/export`,
      {},
      {
        headers: authHeader(),
      }
    );
  }
}

const albumService = new AlbumService();
export default albumService;
