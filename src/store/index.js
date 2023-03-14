import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { books } from "./book.module";

const store = createStore({
  modules: {
    auth,
    user,
    books,
  },
});

export default store;
