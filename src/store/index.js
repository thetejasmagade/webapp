import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    balance: 0,
    products: [],
    isLoggedIn: false,
    courses: [],
    user: {},
    currentModuleUUID: null
  },
  mutations: {
    setBalance(state, newBalance) {
      state.balance = newBalance;
    },
    setProducts(state, newProducts) {
      newProducts.sort((p1, p2) => p1.Price.UnitAmount > p2.Price.UnitAmount ? 1 : -1);
      state.products = newProducts;
    },
    setIsLoggedIn(state, newIsLoggedIn) {
      state.isLoggedIn = newIsLoggedIn;
    },
    setCourses(state, newCourses) {
      newCourses.sort((c1, c2) => c1.Title < c2.Title ? 1 : -1);
      state.courses = newCourses;
    },
    setUser(state, newUser) {
      state.user = newUser;
    },
    setCurrentModuleUUID(state, newCurrentModuleUUID) {
      state.currentModuleUUID = newCurrentModuleUUID;
    }
  },
  actions: {},
  getters: {
    getBalance(state) {
      return state.balance;
    },
    getProducts(state) {
      return state.products;
    },
    getIsLoggedIn(state) {
      return state.isLoggedIn;
    },
    getCourses(state) {
      return state.courses;
    },
    getUser(state) {
      return state.user;
    },
    getCurrentModuleUUID(state) {
      return state.currentModuleUUID;
    }
  }
});
