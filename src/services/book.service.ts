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

  getBook(bookId) {
    return axios
      .get(API_URL + `books/${bookId}`, { headers: authHeader() })
      .then((response) => {
        return response.data.data;
      });
  }

  createBook(book) {
    const formData = new FormData();
    formData.append("name", book.name);
    formData.append("description", book.description);
    formData.append("image", book.image);
    formData.append("inventory_total_qty", book.inventory_total_qty);
    return axios.post(API_URL + "books", formData, {
      headers: authHeader(),
    });
  }

  updateBook(book) {
    return axios.put(API_URL + `books/${book.id}`, book, {
      headers: authHeader(),
    });
  }

  updateBookImage({ bookId, image }) {
    const formData = new FormData();
    formData.append("image", image);
    return axios.post(API_URL + `books/${bookId}/update_image`, formData, {
      headers: authHeader(),
    });
  }

  deleteBook(bookId) {
    return axios.delete(API_URL + `books/${bookId}`, {
      headers: authHeader(),
    });
  }

  // checkoutBook(bookId) {
  //   return axios.put(
  //     API_URL + `books/${bookId}/checkout`,
  //     {},
  //     {
  //       headers: authHeader(),
  //     }
  //   );
  // }
  checkoutBook({ bookId, due_date }) {
    return axios.post(
      API_URL + `books/${bookId}/checkout`,
      {
        bookId,
        due_date,
      },
      { headers: authHeader() }
    );
  }

  returnBook(bookId) {
    return axios.put(
      API_URL + `books/${bookId}/return`,
      {},
      {
        headers: authHeader(),
      }
    );
  }
}

const bookService = new BookService();
export default bookService;
