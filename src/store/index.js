import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function getDefaultState() {
  return {
    balance: 0,
    subscriptionPlans: [],
    jwtClaims: null,
    courses: [],
    programCS: [],
    userAchievements: [],
    user: null,
    currentModuleUUID: null,
    allInterests: []
  };
}

export default new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    reset(state) {
      Object.assign(state, getDefaultState());
      console.log(state);
    },
    setBalance(state, newBalance) {
      state.balance = newBalance;
    },
    setSubscriptionPlans(state, newSubscriptionPlans) {
      newSubscriptionPlans.sort((p1, p2) => p1.Price.UnitAmount > p2.Price.UnitAmount ? 1 : -1);
      state.subscriptionPlans = newSubscriptionPlans;
    },
    setJWTClaims(state, newJWTClaims) {
      state.jwtClaims = newJWTClaims;
    },
    setCourses(state, newCourses) {
      newCourses.sort((c1, c2) => c1.Title < c2.Title ? -1 : 1);
      state.courses = newCourses;
    },
    setProgramCS(state, newProgramCS) {
      state.programCS = newProgramCS;
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
    },
    setAllInterests(state, newAllInterests){
      state.allInterests = newAllInterests;
    }
  },
  actions: {},
  getters: {
    getBalance(state) {
      return state.balance;
    },
    getSubscriptionPlans(state) {
      return state.subscriptionPlans;
    },
    getIsLoggedIn(state) {
      return state.jwtClaims !== null;
    },
    getIsEmailVerified(state){
      if (!state.jwtClaims){
        return false;
      }
      return state.jwtClaims.email_verified;
    },
    getCourses(state) {
      return state.courses;
    },
    getProgramCS(state) {
      let courses = [];
      for (const courseUUID of state.programCS){
        for (const course of state.courses){
          if (course.UUID === courseUUID){
            courses.push(course);
          }
        }
      }
      return courses;
    },
    getCourse: (state) => (uuid) => {
      return state.courses.find(course => course.UUID === uuid);
    },
    getUser(state) {
      return state.user;
    },
    getUserIsSubscribed(state) {
      if (state.user){
        return state.user.IsSubscribed;
      }
      return false;
    },
    getUserAchievements(state) {
      return state.userAchievements;
    },
    getCurrentModuleUUID(state) {
      return state.currentModuleUUID;
    },
    getAllInterests(state){
      return state.allInterests;
    }
  }
});
