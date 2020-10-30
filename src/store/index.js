import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    balance: 0,
    products: [],
    isLoggedIn: false,
    courses: [],
    userAchievements: [],
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
    setUserAchievements(state, newUserAchievements) {
      newUserAchievements.sort((ua1, ua2) => {
        if (ua1.Category < ua2.Category) {
          return 1;
        } else if (ua1.Category > ua2.Category) {
          return -1;
        }
        return ua1.GemReward < ua2.GemReward ? -1 : 1;
      });
      state.userAchievements = newUserAchievements;
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
    getUserAchievements(state) {
      return state.userAchievements;
    },
    getCurrentModuleUUID(state) {
      return state.currentModuleUUID;
    }
  }
});
