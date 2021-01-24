import {
  getCourses,
  getLastGemTransaction,
  getUser,
  getProducts,
  isLoggedIn,
  getJWTClaims,
  logout,
  getUserAchievements,
  getInterests
} from '@/lib/cloudClient.js';

export async function loadAllInterests(thisComponent){
  try {
    const interests = await getInterests();
    thisComponent.$store.commit('setAllInterests', interests);
  } catch (err) {
    thisComponent.$notify({
      type: 'error',
      text: err
    });
  }
}

export async function loadCourses(thisComponent){
  try {
    const courses = await getCourses();
    thisComponent.$store.commit('setCourses', courses);
  } catch (err) {
    thisComponent.$notify({
      type: 'error',
      text: err
    });
  }
}

export async function loadUserAchievements(thisComponent) {
  try {
    const userAchievements = await getUserAchievements();
    thisComponent.$store.commit('setUserAchievements', userAchievements);
  } catch (err) {
    thisComponent.$notify({
      type: 'error',
      text: err
    });
  }
}

export async function loadBalance(thisComponent) {
  try {
    const lastGemTransaction = await getLastGemTransaction();
    thisComponent.$store.commit('setBalance', lastGemTransaction.Balance);
  } catch (err) {
    thisComponent.$notify({
      type: 'error',
      text: err
    });
  }
}

export async function loadProducts(thisComponent) {
  try {
    const products = await getProducts();
    thisComponent.$store.commit('setProducts', products);
  } catch (err) {
    thisComponent.$notify({
      type: 'error',
      text: err
    });
  }
}


export async function loadUser(thisComponent) {
  try {
    const user = await getUser();
    thisComponent.$store.commit('setUser', user);
  } catch (err) {
    thisComponent.$notify({
      type: 'error',
      text: err
    });
  }
}

export function loadLoggedIn(thisComponent) {
  thisComponent.$store.commit('setJWTClaims', getJWTClaims());
  if (!thisComponent.$store.getters.getIsLoggedIn &&
      thisComponent.$router.currentRoute.name !== 'Login') {
    thisComponent.$router.push({ name: 'Login' });
    return;
  }
  if (thisComponent.$store.getters.getIsLoggedIn &&
      !thisComponent.$store.getters.getIsEmailVerified) {
    thisComponent.$router.push({ name: 'VerifyEmail' });
  }
}

export function setLogout(thisComponent) {
  logout();
  thisComponent.$store.commit('setIsLoggedIn', isLoggedIn());
  thisComponent.$router.push({ name: 'Login' });
}
