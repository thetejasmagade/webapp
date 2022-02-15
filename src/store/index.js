import { createStore } from "vuex";
import { createCourseUnit, createProjectUnit } from "@/lib/unit.js";

function getDefaultState() {
  return {
    balance: 0,
    subscriptionPlans: [],
    jwtClaims: null,
    courses: [],
    projects: [],
    programCS: [],
    trackDSAlgos: [],
    trackGopherGang: [],
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
    setTrackCS(state, newProgramCS) {
      state.programCS = newProgramCS;
    },
    setTrackDSAlgos(state, newTrackDSAlgos) {
      state.trackDSAlgos = newTrackDSAlgos;
    },
    setTrackGopherGang(state, newTrackGopherGang) {
      state.trackGopherGang = newTrackGopherGang;
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
    getTrackCS(state) {
      let items = [];
      for (const uuid of state.programCS) {
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
    getTrackDSAlgos(state) {
      let items = [];
      for (const uuid of state.trackDSAlgos) {
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
    getTrackGopherGang(state) {
      let items = [];
      for (const uuid of state.trackGopherGang) {
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
      return state.userAchievements;
    },
    getCurrentModuleUUID(state) {
      return state.currentModuleUUID;
    },
    getAllInterests(state) {
      return state.allInterests;
    },
  },
});
