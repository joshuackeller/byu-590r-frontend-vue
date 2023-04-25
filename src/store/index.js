import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { books } from "./book.module";
import { artists } from "./artist.module";
import { genres } from "./genre.module";

const store = createStore({
  modules: {
    auth,
    user,
    books,
    artists,
    genres,
  },
});

export default store;
