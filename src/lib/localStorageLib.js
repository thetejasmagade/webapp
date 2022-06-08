const jwtKey = "cloudJWT";
const trueString = "true";

export const seenSandboxModalLoginKey = "seenSandboxModalLogin";
export const seenSandboxModalPatronKey = "seenSandboxModalPatron";
export const seenDiscordSyncInsertKey = "seenDiscordSyncInsert";
export const seenFriendsInsertKey = "seenFriendsInsert";
export const seenInsightInsertKey = "seenInsightInsert";
const registerIsSubscribedNewsKey = "registerIsSubscribedNews";

export function saveRegisterIsSubscribedNews() {
  localStorage.setItem(registerIsSubscribedNewsKey, trueString);
}

export function loadRegisterIsSubscribedNews() {
  const v = localStorage.getItem(registerIsSubscribedNewsKey);
  return v === trueString;
}

// add the courseUUID / project UUID to the end
export function getSeenUnitDoneModalKey(unitUUID) {
  return `seenUnitDoneModal-${unitUUID}`;
}

export function saveCloudJWT(token) {
  localStorage.setItem(jwtKey, token);
}

export function loadCloudJWT() {
  const token = localStorage.getItem(jwtKey);
  if (!token) {
    throw "no progress found";
  }
  return token;
}

export function removeCloudJWT() {
  localStorage.removeItem(jwtKey);
}

export function markSeen(key) {
  localStorage.setItem(key, trueString);
}

export function hasSeen(key) {
  const val = localStorage.getItem(key);
  return val === trueString;
}

function getExerciseCodeKey(userUUID, exerciseUUID) {
  return `cachedCode-${userUUID}-${exerciseUUID}`;
}

export function cacheExerciseCode(userUUID, exerciseUUID, codeToCache) {
  const key = getExerciseCodeKey(userUUID, exerciseUUID);
  const val = codeToCache;
  localStorage.setItem(key, val);
}

export function hasCachedCode(userUUID, exerciseUUID) {
  const cachedCode = localStorage.getItem(
    getExerciseCodeKey(userUUID, exerciseUUID)
  );
  if (!cachedCode) {
    return false;
  }
  return cachedCode;
}

export function deleteCachedCode(userUUID, exerciseUUID) {
  localStorage.removeItem(getExerciseCodeKey(userUUID, exerciseUUID));
}
