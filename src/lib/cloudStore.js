import {
  getCourses,
  getTrackCS,
  getTrackDSAlgos,
  getTrackGopherGang,
  getLastGemTransaction,
  getUser,
  getSubscriptionPlans,
  getJWTClaims,
  logout,
  getUserAchievements,
  getInterests,
  getProjects
} from '@/lib/cloudClient.js';

export async function loadAllInterests(thisComponent){
  if (thisComponent.$store.getters.getAllInterests.length !== 0){
    return;
  }
  const interests = await getInterests();
  thisComponent.$store.commit('setAllInterests', interests);
}

export async function loadCourses(thisComponent){
  const courses = await getCourses();
  thisComponent.$store.commit('setCourses', courses);
}

export async function loadProjects(thisComponent){
  const projects = await getProjects();
  thisComponent.$store.commit('setProjects', projects);
}

export async function loadTracks(thisComponent){
  if (!thisComponent.$store.getters.getCourses ||
    thisComponent.$store.getters.getCourses.length === 0){
    await Promise.all([
      loadCourses(thisComponent),
      loadProjects(thisComponent)
    ]);
  }
  await Promise.all([
    (async()=>{
      const courses = await getTrackCS();
      thisComponent.$store.commit('setTrackCS', courses);
    })(),
    (async()=>{
      const courses = await getTrackDSAlgos();
      thisComponent.$store.commit('setTrackDSAlgos', courses);
    })(),
    (async()=>{
      const courses = await getTrackGopherGang();
      thisComponent.$store.commit('setTrackGopherGang', courses);
    })()
  ]);
}

export async function loadUserAchievements(thisComponent) {
  const userAchievements = await getUserAchievements();
  thisComponent.$store.commit('setUserAchievements', userAchievements);
}

export async function loadBalance(thisComponent) {
  const lastGemTransaction = await getLastGemTransaction();
  thisComponent.$store.commit('setBalance', lastGemTransaction.Balance);
}

export async function loadSubscriptionPlans(thisComponent) {
  const subscriptionPlans = await getSubscriptionPlans();
  thisComponent.$store.commit('setSubscriptionPlans', subscriptionPlans);
}

export async function loadUser(thisComponent) {
  const user = await getUser();
  thisComponent.$store.commit('setUser', user);
}

export function loadLoggedIn(thisComponent) {
  thisComponent.$store.commit('setJWTClaims', getJWTClaims());
}

export function setLogout(thisComponent) {
  logout();
  thisComponent.$store.commit('reset');
  thisComponent.$router.push({ name: 'Login' });
}
