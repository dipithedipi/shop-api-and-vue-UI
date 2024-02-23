import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    user: null,
    token: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {},
  getters: {
    isLoggedIn(state) {
      if (state.token === null || state.token === "" || state.token === undefined) {
        return false;
      }

      fetch("http://127.0.0.1:3000/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application",
        },
        body: JSON.stringify({ token: state.token }),
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            return data.valid;
          });
        } else {
          return false;
        }
      })
    },
user(state) {
  return state.user;
},
token(state) {
  return state.token;
},
  },
});