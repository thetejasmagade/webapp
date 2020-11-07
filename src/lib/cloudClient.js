import decodeJWT from './decodeJWT';

export const domain = 'https://api.classroom.qvault.io';

const jwtKey = 'cloudJWT';

export function loginToken(token) {
  localStorage.setItem(jwtKey, token);
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
  localStorage.setItem(jwtKey, handled.token);
  return handled;
}

export async function loginGoogle(googleJWT, isSubscribedNews) {
  const resp = await fetch(`${domain}/v1/auth/google/login`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      googleJWT,
      isSubscribedNews
    })
  });
  const handled = await handleJSONResponse(resp);
  localStorage.setItem(jwtKey, handled.token);

  if (resp.status === 201){
    handled.registered = true;
  }

  return handled;
}

export function getLoginWithTwitterURL(isSubscribedNews){
  return `${domain}/v1/auth/twitter/login?is_subscribed_news=${isSubscribedNews}`;
}

export function getLoginWithGithubURL(isSubscribedNews) {
  return `${domain}/v1/auth/github/login?is_subscribed_news=${isSubscribedNews}`;
}

export async function updateTwitterUser() {
  const resp = await fetchWithAuth(`${domain}/v1/users/twitter/update`, {
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
  localStorage.setItem(jwtKey, handled.token);
  return handled;
}

export async function createUserManual(email, password, firstName, lastName, isSubscribedNews){
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
      isSubscribedNews
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUser(
  firstName, 
  lastName, 
  bio, 
  jobTitle, 
  location, 
  twitterHandle,
  linkedinURL,
  githubHandle,
  websiteURL
){
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
      websiteURL
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

export async function compileRust(code) {
  const resp = await fetch(`${domain}/v1/compile/rust`, {
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

export async function getProducts(){
  const resp = await fetchWithAuth(`${domain}/v1/products`, {
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

export async function completePayments() {
  const resp = await fetchWithAuth(`${domain}/v1/products`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function startProductCheckout(productID){
  const resp = await fetchWithAuth(`${domain}/v1/products/${productID}/checkout`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCourses(){
  const resp = await fetchWithAuth(`${domain}/v1/courses`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCoursesPublic(handle){
  const resp = await fetch(`${domain}/v1/courses/public/${handle}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function purchaseCourse(courseUUID){
  const resp = await fetchWithAuth(`${domain}/v1/courses/${courseUUID}/purchase`, {
    method: 'POST',
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

export async function getDemoExercises(courseUUID) {
  const resp = await fetch(`${domain}/v1/courses/${courseUUID}/exercises/demos`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitCodeExercise(exerciseUUID, output, isDemo){
  const resp = await fetchWithAuth(`${domain}/v1/exercises/${exerciseUUID}/code`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      output,
      isDemo
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitMultipleChoiceExercise(exerciseUUID, answer, isDemo){
  const resp = await fetchWithAuth(`${domain}/v1/exercises/${exerciseUUID}/multiple_choice`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      answer,
      isDemo
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitInformationalExercise(exerciseUUID, isDemo){
  const resp = await fetchWithAuth(`${domain}/v1/exercises/${exerciseUUID}/informational`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      isDemo
    })
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export function logout(){
  localStorage.removeItem(jwtKey);
}

export function isLoggedIn(){
  try {
    let token = localStorage.getItem(jwtKey);
    let decodedToken = decodeJWT(token);
    return decodedToken.exp > Date.now() / 1000;
  } catch (err){
    return false;
  }
}

async function fetchWithAuth(url, params){
  if (!isLoggedIn()){
    // redirect to login screen
    return;
  }
  let token = localStorage.getItem(jwtKey);
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
