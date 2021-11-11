import decodeJWT from './decodeJWT';
import {
  saveCloudJWT,
  loadCloudJWT,
  removeCloudJWT
} from './localStorageLib';

export const domain = 'https://qvault-classroom.wm.r.appspot.com';

export function loginToken(token) {
  saveCloudJWT(token);
}

export async function loginManual(email, password){
  const resp = await fetch(`${domain}/v1/auth`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });
  const handled = await handleJSONResponse(resp);
  saveCloudJWT(handled.token);
  return handled;
}

export async function loginGoogle(googleJWT, isSubscribedNews, referringUserUUID) {
  const resp = await fetch(`${domain}/v1/auth/google/login`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      googleJWT,
      isSubscribedNews,
      referringUserUUID
    })
  });
  const handled = await handleJSONResponse(resp);
  saveCloudJWT(handled.token);

  if (resp.status === 201){
    handled.registered = true;
  }

  return handled;
}

export function getLoginWithGithubURL(isSubscribedNews, referringUserUUID) {
  return `${domain}/v1/auth/github/login?is_subscribed_news=${isSubscribedNews}&referring_user_id=${referringUserUUID}`;
}

export async function updateUserCache() {
  const resp = await fetchWithAuth(`${domain}/v1/users/cache/update`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

async function refreshToken(){
  const resp = await fetchWithAuth(`${domain}/v1/auth/refresh`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  saveCloudJWT(handled.token);
  return handled;
}

export async function trackUserCancelCheckout(){
  const resp = await fetchWithAuth(`${domain}/v1/tracking/user_cancel_checkout`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function confirmOnetimePurchase(){
  const resp = await fetchWithAuth(`${domain}/v1/subscription_plans/onetime_purchases`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function createUserManual(email, password, firstName, lastName, isSubscribedNews, referringUserUUID){
  const resp = await fetch(`${domain}/v1/users`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password, 
      firstName,
      lastName,
      isSubscribedNews,
      referringUserUUID
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function upsertExerciseFeedback(
  exerciseUUID,
  text
){
  const resp = await fetchWithAuth(`${domain}/v1/exercises/${exerciseUUID}/feedback`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function deleteUser(){
  const resp = await fetchWithAuth(`${domain}/v1/users`, {
    method: 'DELETE',
    mode: 'cors'
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUser({
  firstName, 
  lastName, 
  bio, 
  jobTitle, 
  location, 
  twitterHandle,
  linkedinURL,
  githubHandle,
  websiteURL,
  experienceLevel,
  recruitersCanContact,
  isRecruiter
}){
  function emptyToNull(s){
    if (s === ''){
      return null;
    }
    return s;
  }

  firstName = emptyToNull(firstName);
  lastName = emptyToNull(lastName);
  bio = emptyToNull(bio);
  jobTitle = emptyToNull(jobTitle);
  location = emptyToNull(location);
  twitterHandle = emptyToNull(twitterHandle);
  linkedinURL = emptyToNull(linkedinURL);
  githubHandle = emptyToNull(githubHandle);
  websiteURL = emptyToNull(websiteURL);
  experienceLevel = emptyToNull(experienceLevel);

  const resp = await fetchWithAuth(`${domain}/v1/users`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName,
      lastName,
      bio,
      jobTitle,
      location,
      twitterHandle,
      linkedinURL,
      githubHandle,
      websiteURL,
      experienceLevel,
      recruitersCanContact,
      isRecruiter
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserHandle(handle) {
  const resp = await fetchWithAuth(`${domain}/v1/users/handle`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      handle
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserInterests(interestUUIDs) {
  const resp = await fetchWithAuth(`${domain}/v1/users/interests`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      interestUUIDs
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getUser() {
  const resp = await fetchWithAuth(`${domain}/v1/users`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getProgramCS() {
  const resp = await fetchWithAuth(`${domain}/v1/programs/cs`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getTrackDSAlgos() {
  const resp = await fetchWithAuth(`${domain}/v1/tracks/ds_algos`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}


export async function getTrackGopherGang() {
  const resp = await fetchWithAuth(`${domain}/v1/tracks/gopher_gang`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getUserPublic(handle) {
  const resp = await fetch(`${domain}/v1/users/public/${handle}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserPassword(email, oldPassword, newPassword){
  const resp = await fetch(`${domain}/v1/users/password`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      oldPassword,
      newPassword
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserPasswordCode(email, newPassword, code){
  const resp = await fetch(`${domain}/v1/users/password`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      newPassword,
      code
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserProfileImage(formData) {
  const resp = await fetchWithAuth(`${domain}/v1/users/profile_image`, {
    method: 'PUT',
    mode: 'cors',
    body: formData
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserResume(formData) {
  const resp = await fetchWithAuth(`${domain}/v1/users/resume`, {
    method: 'PUT',
    mode: 'cors',
    body: formData
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function sendEmailVerification(email){
  const resp = await fetch(`${domain}/v1/users/email/send_verification`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function verifyEmail(code){
  const resp = await fetchWithAuth(`${domain}/v1/users/email/verify`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code
    })
  });
  const handled = await handleJSONResponse(resp);
  saveCloudJWT(handled.token);
  return handled;
}

export async function compileGo(code){
  const resp = await fetch(`${domain}/v1/compile/go`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code
    })
  });
  const handled = await handleWasmResponse(resp);
  return handled;
}

export async function compilePureScript(code) {
  const resp = await fetch(`${domain}/v1/compile/purescript`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getLastGemTransaction(){
  const resp = await fetchWithAuth(`${domain}/v1/gem_transactions/last`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getRewards() {
  const resp = await fetchWithAuth(`${domain}/v1/rewards`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function useCouponCode(couponCode) {
  const resp = await fetchWithAuth(`${domain}/v1/coupons/use`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      couponCode
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getSubscriptionPlans(){
  const resp = await fetch(`${domain}/v1/subscription_plans`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function startSubscriptionPlanCheckout(priceID, referralID){
  const resp = await fetchWithAuth(`${domain}/v1/subscription_plans/${priceID}/checkout`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      referralID
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function openCustomerPortal() {
  const resp = await fetchWithAuth(`${domain}/v1/customer_portal`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  window.location.href = handled.URL;
}

export async function getInterests(){
  const resp = await fetchWithAuth(`${domain}/v1/interests`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getUserAchievements() {
  const resp = await fetchWithAuth(`${domain}/v1/users/achievements`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getUserAchievementsPublic(handle) {
  const resp = await fetch(`${domain}/v1/users/achievements/public/${handle}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCourses(courseUUID){
  const resp = await fetchWithAuth(`${domain}/v1/courses?course_uuid=${courseUUID}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCoursePublic(courseUUID){
  const resp = await fetch(`${domain}/v1/courses/public/${courseUUID}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCoursesPublic(userHandle){
  const resp = await fetch(`${domain}/v1/users/public/${userHandle}/courses`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCurrentExercise(courseUUID){
  const resp = await fetchWithAuth(`${domain}/v1/courses/${courseUUID}/exercises/current`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getFirstExerciseInModule(courseUUID, moduleUUID) {
  const resp = await fetchWithAuth(`${domain}/v1/courses/${courseUUID}/modules/${moduleUUID}/exercises/first`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getExerciseByID(courseUUID, exerciseUUID) {
  const resp = await fetchWithAuth(`${domain}/v1/courses/${courseUUID}/exercises/by_id/${exerciseUUID}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getFirstExercise(courseUUID) {
  const resp = await fetchWithAuth(`${domain}/v1/courses/${courseUUID}/exercises/first`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getPreviousExercise(courseUUID, currentExerciseUUID) {
  const resp = await fetchWithAuth(`${domain}/v1/courses/${courseUUID}/exercises/previous/${currentExerciseUUID}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getNextExercise(courseUUID, currentExerciseUUID) {
  const resp = await fetchWithAuth(`${domain}/v1/courses/${courseUUID}/exercises/next/${currentExerciseUUID}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitCodeCanvasExercise(exerciseUUID, canvasHash){
  const resp = await fetchWithAuth(`${domain}/v1/exercises/${exerciseUUID}/code_canvas`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      canvasHash
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitCodeExercise(exerciseUUID, output){
  const resp = await fetchWithAuth(`${domain}/v1/exercises/${exerciseUUID}/code`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      output
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitMultipleChoiceExercise(exerciseUUID, answer){
  const resp = await fetchWithAuth(`${domain}/v1/exercises/${exerciseUUID}/multiple_choice`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      answer
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitInformationalExercise(exerciseUUID){
  const resp = await fetchWithAuth(`${domain}/v1/exercises/${exerciseUUID}/informational`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getUsersAsRecruiter() {
  const resp = await fetchWithAuth(`${domain}/v1/recruiters/users`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export function logout(){
  removeCloudJWT();
}

export function isLoggedIn(){
  try {
    let decodedToken = getJWTClaims();
    return decodedToken.exp > Date.now() / 1000;
  } catch (err){
    return false;
  }
}

export function getJWTClaims(){
  try {
    let token = loadCloudJWT();
    return decodeJWT(token);
  } catch (err){
    return null;
  }
}

async function fetchWithAuth(url, params){
  if (!isLoggedIn()){
    throw 'You\'re not logged in, please logout and back in';
  }
  let token = loadCloudJWT();
  let decodedToken = decodeJWT(token);
  const hoursDelta = 24;
  if (decodedToken.exp < (Date.now() + hoursDelta*60*60) / 1000){
    refreshToken();
  }

  if (!params.headers){
    params.headers = {};
  }
  params.headers.Authorization = `Bearer ${token}`;
  return await fetch(url, params);
}

async function handleWasmResponse(response) {
  if (!response.ok) {
    const json = await response.json();
    if (typeof json.error !== 'undefined') {
      throw json.error;
    }
    throw 'Unknown error occured';
  }
  return await response.arrayBuffer();
}
  
async function handleJSONResponse(response) {
  const json = await response.json();
  if (typeof json.error !== 'undefined') {
    throw json.error;
  } else if (!response.ok) {
    throw 'Unknown error occured';
  }
  return json;
}
