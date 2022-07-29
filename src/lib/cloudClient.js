import decodeJWT from "./decodeJWT";
import { saveCloudJWT, loadCloudJWT, removeCloudJWT } from "./localStorageLib";

export const domain = "https://api.boot.dev";

export function loginToken(token) {
  saveCloudJWT(token);
}

export async function loginGoogle(
  googleJWT,
  isSubscribedNews,
  referringUserUUID
) {
  const resp = await fetch(`${domain}/v1/auth/google/login`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      googleJWT,
      isSubscribedNews,
      referringUserUUID,
    }),
  });
  const handled = await handleJSONResponse(resp);
  saveCloudJWT(handled.token);

  if (resp.status === 201) {
    handled.registered = true;
  }

  return handled;
}

export function getLoginWithGithubURL(isSubscribedNews, referringUserUUID) {
  return `${domain}/v1/auth/github/login?is_subscribed_news=${isSubscribedNews}&referring_user_id=${referringUserUUID}`;
}

async function refreshToken() {
  const resp = await fetchWithAuth(`${domain}/v1/auth/refresh`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  saveCloudJWT(handled.token);
  return handled;
}

export async function trackUserCancelCheckout() {
  const resp = await fetchWithAuth(
    `${domain}/v1/tracking/user_cancel_checkout`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function confirmOnetimePurchase() {
  const resp = await fetchWithAuth(
    `${domain}/v1/subscription_plans/onetime_purchases`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function imageURLToTwitterImageURL(imageURL) {
  const resp = await fetch(`${domain}/v1/twitter_convert_image`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageURL,
    }),
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function createUserManual(
  email,
  firstName,
  lastName,
  isSubscribedNews,
  referringUserUUID
) {
  const resp = await fetch(`${domain}/v1/users`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      firstName,
      lastName,
      isSubscribedNews,
      referringUserUUID,
    }),
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function upsertExerciseFeedback(exerciseUUID, text) {
  const resp = await fetchWithAuth(
    `${domain}/v1/exercises/${exerciseUUID}/feedback`,
    {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function upsertStepFeedback(uuid, text) {
  const resp = await fetchWithAuth(`${domain}/v1/steps/${uuid}/feedback`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function deleteUser() {
  const resp = await fetchWithAuth(`${domain}/v1/users`, {
    method: "DELETE",
    mode: "cors",
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
  isSubscribedNews,
}) {
  function zeroToNull(s) {
    if (!s) {
      return null;
    }
    return s;
  }

  firstName = zeroToNull(firstName);
  lastName = zeroToNull(lastName);
  bio = zeroToNull(bio);
  jobTitle = zeroToNull(jobTitle);
  location = zeroToNull(location);
  twitterHandle = zeroToNull(twitterHandle);
  linkedinURL = zeroToNull(linkedinURL);
  githubHandle = zeroToNull(githubHandle);
  websiteURL = zeroToNull(websiteURL);
  experienceLevel = zeroToNull(experienceLevel);
  experienceLevel = zeroToNull(experienceLevel);
  isSubscribedNews = zeroToNull(isSubscribedNews);

  const resp = await fetchWithAuth(`${domain}/v1/users`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
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
      isSubscribedNews,
    }),
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserHandle(handle) {
  const resp = await fetchWithAuth(`${domain}/v1/users/handle`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      handle,
    }),
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserAPIKey() {
  const resp = await fetchWithAuth(`${domain}/v1/users/apikey`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserInterests(interestUUIDs) {
  const resp = await fetchWithAuth(`${domain}/v1/users/interests`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      interestUUIDs,
    }),
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getUser() {
  const resp = await fetchWithAuth(`${domain}/v1/users`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getTrack(trackSlug) {
  const resp = await fetchWithAuthIfAuthed(`${domain}/v1/tracks/${trackSlug}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getUserPublic(handle) {
  const resp = await fetch(`${domain}/v1/users/public/${handle}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserPassword(email, oldPassword, newPassword) {
  const resp = await fetch(`${domain}/v1/users/password`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      oldPassword,
      newPassword,
    }),
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserProfileImage(formData) {
  const resp = await fetchWithAuth(`${domain}/v1/users/profile_image`, {
    method: "PUT",
    mode: "cors",
    body: formData,
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function updateUserResume(formData) {
  const resp = await fetchWithAuth(`${domain}/v1/users/resume`, {
    method: "PUT",
    mode: "cors",
    body: formData,
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function sendMagicLink(email, newUser) {
  const resp = await fetch(`${domain}/v1/users/email/send_magic_link`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      newUser,
    }),
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function compileGo(code) {
  const resp = await fetch(`${domain}/v1/compile/go`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  const handled = await handleWasmResponse(resp);
  return handled;
}

export async function compilePureScript(code) {
  const resp = await fetch(`${domain}/v1/compile/purescript`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function runSQL(code, upStatements) {
  const resp = await fetch(`${domain}/v1/courses_sql_api`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      upStatements,
    }),
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getSubscriptionPlans() {
  const resp = await fetch(`${domain}/v1/subscription_plans`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function startSubscriptionPlanCheckout(priceID, referralID) {
  const resp = await fetchWithAuth(
    `${domain}/v1/subscription_plans/${priceID}/checkout`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        referralID,
      }),
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function openCustomerPortal() {
  const resp = await fetchWithAuth(`${domain}/v1/customer_portal`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  window.location.href = handled.URL;
}

export async function getInterests() {
  const resp = await fetch(`${domain}/v1/interests`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getLeaderBoardNumExercisesHistogram(timeframe) {
  const resp = await fetch(
    `${domain}/v1/leaderboard_num_exercises_histogram/${timeframe}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getLeaderBoardNumExercises(timeframe) {
  const resp = await fetch(
    `${domain}/v1/leaderboard_num_exercises/${timeframe}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getLeaderBoardXP() {
  const resp = await fetch(`${domain}/v1/leaderboard_xp/alltime`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getUserAchievements() {
  const resp = await fetchWithAuth(`${domain}/v1/users/achievements`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getPendingAchievements() {
  const resp = await fetchWithAuth(`${domain}/v1/achievements/pending`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getAchievementsProgress() {
  const resp = await fetchWithAuth(`${domain}/v1/achievements/progress`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function markAchievementSeen(achievementUUID) {
  const resp = await fetchWithAuth(
    `${domain}/v1/achievements/mark_seen/${achievementUUID}`,
    {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getUserAchievementsPublic(handle) {
  const resp = await fetch(`${domain}/v1/users/achievements/public/${handle}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCourses(courseUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/courses?course_uuid=${courseUUID}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getProjects() {
  const resp = await fetchWithAuthIfAuthed(`${domain}/v1/projects`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCoursePublic(courseUUID) {
  const resp = await fetch(`${domain}/v1/courses/public/${courseUUID}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCoursesPublic(userHandle) {
  const resp = await fetch(`${domain}/v1/users/public/${userHandle}/courses`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getProjectsPublic(userHandle) {
  const resp = await fetch(`${domain}/v1/users/public/${userHandle}/projects`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCourseProgress(courseUUID) {
  const resp = await fetchWithAuth(
    `${domain}/v1/course_progress/${courseUUID}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getProjectProgress(projectUUID) {
  const resp = await fetchWithAuth(
    `${domain}/v1/project_progress/${projectUUID}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getUnitsProgress() {
  const resp = await fetchWithAuth(`${domain}/v1/units_progress`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCurrentExercise(courseUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/courses/${courseUUID}/exercises/current`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getFirstExerciseInModule(courseUUID, moduleUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/courses/${courseUUID}/modules/${moduleUUID}/exercises/first`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getExerciseByID(courseUUID, exerciseUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/courses/${courseUUID}/exercises/by_id/${exerciseUUID}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getFirstExercise(courseUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/courses/${courseUUID}/exercises/first`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getPreviousExercise(courseUUID, currentExerciseUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/courses/${courseUUID}/exercises/previous/${currentExerciseUUID}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getNextExercise(courseUUID, currentExerciseUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/courses/${courseUUID}/exercises/next/${currentExerciseUUID}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getCurrentStep(projectUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/projects/${projectUUID}/steps/current`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getStepByID(projectUUID, stepUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/projects/${projectUUID}/steps/by_id/${stepUUID}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getFirstStep(projectUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/projects/${projectUUID}/steps/first`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getPreviousStep(projectUUID, currentStepUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/projects/${projectUUID}/steps/previous/${currentStepUUID}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function getNextStep(projectUUID, currentStepUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/projects/${projectUUID}/steps/next/${currentStepUUID}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function markHintSeen(exerciseUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/exercises/${exerciseUUID}/mark_hint_seen`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function markSolutionSeen(exerciseUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/exercises/${exerciseUUID}/mark_solution_seen`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitCodeCanvasExercise(exerciseUUID, canvasHash) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/exercises/${exerciseUUID}/code_canvas`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        canvasHash,
      }),
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitCodeExercise(exerciseUUID, output) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/exercises/${exerciseUUID}/code`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        output,
      }),
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitMultipleChoiceExercise(exerciseUUID, answer) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/exercises/${exerciseUUID}/multiple_choice`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer,
      }),
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitInformationalStep(stepUUID) {
  const resp = await fetchWithAuthIfAuthed(
    `${domain}/v1/steps/${stepUUID}/informational`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitManualStep(stepUUID) {
  const resp = await fetchWithAuth(
    `${domain}/v1/steps/${stepUUID}/informational`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export async function submitRepoStep(stepUUID, repoSubmissionLink) {
  const resp = await fetchWithAuth(
    `${domain}/v1/steps/${stepUUID}/submit_repo`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repoSubmission: repoSubmissionLink,
      }),
    }
  );
  const handled = await handleJSONResponse(resp);
  return handled;
}

export function logout() {
  removeCloudJWT();
}

export function isLoggedIn() {
  try {
    let decodedToken = getJWTClaims();
    return decodedToken.exp > Date.now() / 1000;
  } catch (err) {
    return false;
  }
}

export function getJWTClaims() {
  try {
    let token = loadCloudJWT();
    return decodeJWT(token);
  } catch (err) {
    return null;
  }
}

async function fetchWithAuthIfAuthed(url, params) {
  if (!isLoggedIn()) {
    return await fetch(url, params);
  }
  return await fetchWithAuth(url, params);
}

async function fetchWithAuth(url, params) {
  if (!isLoggedIn()) {
    logout();
    window.location.href = `/?redirect=${window.location.pathname}`;
  }
  let token = loadCloudJWT();
  let decodedToken = decodeJWT(token);
  const hoursDelta = 24;
  if (decodedToken.exp < (Date.now() + hoursDelta * 60 * 60) / 1000) {
    refreshToken();
  }
  if (!params.headers) {
    params.headers = {};
  }
  params.headers.Authorization = `Bearer ${token}`;
  return await fetch(url, params);
}

async function handleWasmResponse(response) {
  if (!response.ok) {
    const json = await response.json();
    if (typeof json.error !== "undefined") {
      throw json.error;
    }
    throw "Unknown error occured";
  }
  return await response.arrayBuffer();
}

async function handleJSONResponse(response) {
  const json = await response.json();
  if (typeof json.error !== "undefined") {
    throw json.error;
  } else if (!response.ok) {
    throw "Unknown error occured";
  }
  return json;
}
