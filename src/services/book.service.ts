import axios from "axios";
import API_URL from "./env";
import authHeader from "./auth-header";
class BookService {
  getBooks() {
    return axios
      .get(API_URL + "books", { headers: authHeader() })
      .then((response) => {
        return response.data.data;
      });
  }
}

const bookService = new BookService();
export default bookService;
