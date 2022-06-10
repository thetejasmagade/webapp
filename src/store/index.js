import { createStore } from "vuex";
import { createCourseUnit, createProjectUnit } from "@/lib/unit.js";

function getDefaultState() {
  return {
    balance: 0,
    subscriptionPlans: [],
    jwtClaims: null,
    courses: [],
    projects: [],
    tracks: {},
    userAchievements: [],
    user: null,
    currentModuleUUID: null,
    allInterests: [],
  };
}

export default createStore({
  state: getDefaultState(),
  mutations: {
    reset(state) {
      Object.assign(state, getDefaultState());
    },
    setBalance(state, newBalance) {
      state.balance = newBalance;
    },
    setSubscriptionPlans(state, newSubscriptionPlans) {
      newSubscriptionPlans.sort((p1, p2) =>
        p1.Price.UnitAmount > p2.Price.UnitAmount ? 1 : -1
      );
      state.subscriptionPlans = newSubscriptionPlans;
    },
    setJWTClaims(state, newJWTClaims) {
      state.jwtClaims = newJWTClaims;
    },
    setCourses(state, newCourses) {
      newCourses.sort((c1, c2) => (c1.Title < c2.Title ? -1 : 1));
      state.courses = newCourses;
    },
    setProjects(state, newProjects) {
      newProjects.sort((p1, p2) => (p1.Title < p2.Title ? -1 : 1));
      state.projects = newProjects;
    },
    setTrack(state, { courses, trackSlug }) {
      state.tracks[trackSlug] = courses;
    },
    setUserAchievements(state, newUserAchievements) {
      state.userAchievements = newUserAchievements;
    },
    setUser(state, newUser) {
      state.user = newUser;
    },
    setCurrentModuleUUID(state, newCurrentModuleUUID) {
      state.currentModuleUUID = newCurrentModuleUUID;
    },
    setAllInterests(state, newAllInterests) {
      state.allInterests = newAllInterests;
    },
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
    getIsEmailVerified(state) {
      if (!state.jwtClaims) {
        return false;
      }
      return state.jwtClaims.email_verified;
    },
    getCourses(state) {
      return state.courses;
    },
    getProjects(state) {
      return state.projects;
    },
    getUnits(state) {
      const units = [];
      for (const project of state.projects) {
        units.push(createProjectUnit(project));
      }
      for (const course of state.courses) {
        units.push(createCourseUnit(course));
      }
      return units;
    },
    getTrack: (state) => (trackSlug) => {
      let items = [];
      if (!(trackSlug in state.tracks)) {
        return null;
      }
      for (const uuid of state.tracks[trackSlug]) {
        for (const course of state.courses) {
          if (course.UUID === uuid) {
            items.push(createCourseUnit(course));
          }
        }
        for (const project of state.projects) {
          if (project.UUID === uuid) {
            items.push(createProjectUnit(project));
          }
        }
      }
      return items;
    },
    getCourse: (state) => (uuid) => {
      return state.courses.find((course) => course.UUID === uuid);
    },
    getProject: (state) => (uuid) => {
      return state.projects.find((project) => project.UUID === uuid);
    },
    getUser(state) {
      return state.user;
    },
    getUserIsSubscribed(state) {
      if (state.user) {
        return state.user.IsSubscribed;
      }
      return false;
    },
    getUserAchievements(state) {
      const sortedAchievements = [];
      for (const achievement of state.userAchievements) {
        sortedAchievements.push(achievement);
      }
      sortedAchievements.sort((ua1, ua2) => {
        if (ua1.Category < ua2.Category) {
          return 1;
        } else if (ua1.Category > ua2.Category) {
          return -1;
        }
        return ua1.Order < ua2.Order ? -1 : 1;
      });
      return sortedAchievements;
    },
    getCurrentModuleUUID(state) {
      return state.currentModuleUUID;
    },
    getAllInterests(state) {
      return state.allInterests;
    },
  },
});
