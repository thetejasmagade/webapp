import {
  getCourses,
  getUser,
  getSubscriptionPlans,
  getJWTClaims,
  logout,
  getUserAchievements,
  getInterests,
  getProjects,
  getTrack,
} from "@/lib/cloudClient.js";

export async function loadAllInterests(commit) {
  const interests = await getInterests();
  commit("setAllInterests", interests);
}

export async function loadCourses(commit) {
  const courses = await getCourses();
  commit("setCourses", courses);
}

export async function loadProjects(commit) {
  const projects = await getProjects();
  commit("setProjects", projects);
}

export async function loadTrack(commit, trackSlug) {
  const courses = await getTrack(trackSlug);
  commit("setTrack", { courses, trackSlug });
}

export async function loadUserAchievements(commit) {
  const userAchievements = await getUserAchievements();
  commit("setUserAchievements", userAchievements);
}

export async function loadSubscriptionPlans(thisComponent) {
  const subscriptionPlans = await getSubscriptionPlans();
  thisComponent.$store.commit("setSubscriptionPlans", subscriptionPlans);
}

export async function loadUser(commit) {
  const user = await getUser();
  commit("setUser", user);
}

export function loadLoggedIn(commit) {
  commit("setJWTClaims", getJWTClaims());
}

export function setLogout(commit, router) {
  logout();
  commit("reset");
  router.push({ name: "Login" });
}
