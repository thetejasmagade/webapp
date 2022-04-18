const jwtKey = "cloudJWT";
const seenSandboxModalLoginKey = "seenSandboxModalLogin";
const seenSandboxModalPatronKey = "seenSandboxModalPatron";
const seenDiscordSyncInsertKey = "seenDiscordSyncInsert";
const trueString = "true";

// add the courseUUID / project UUID to the end
function getSeenUnitDoneModalKey(unitUUID) {
  return `seenUnitDoneModal-${unitUUID}`;
}

function getExerciseCodeKey(exerciseUUID) {
  return `cachedCode-${exerciseUUID}`;
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

export function markSeenSandboxModalLoginKey() {
  localStorage.setItem(seenSandboxModalLoginKey, trueString);
}

export function markSeenSandboxModalPatronKey() {
  localStorage.setItem(seenSandboxModalPatronKey, trueString);
}

export function hasSeenSandboxModalLoginKey() {
  const val = localStorage.getItem(seenSandboxModalLoginKey);
  return val === trueString;
}

export function hasSeendSandboxModalPatronKey() {
  const val = localStorage.getItem(seenSandboxModalPatronKey);
  return val === trueString;
}

export function markSeenUnitDoneModal(courseUUID) {
  const key = getSeenUnitDoneModalKey(courseUUID);
  localStorage.setItem(key, trueString);
}

export function hasSeenUnitDoneModal(courseUUID) {
  const key = getSeenUnitDoneModalKey(courseUUID);
  const val = localStorage.getItem(key);
  return val === trueString;
}

export function cacheExerciseCode(exerciseUUID, codeToCache) {
  const key = getExerciseCodeKey(exerciseUUID);
  const val = codeToCache;
  localStorage.setItem(key, val);
}

export function hasCachedCode(exerciseUUID) {
  const cachedCode = localStorage.getItem(getExerciseCodeKey(exerciseUUID));
  if (!cachedCode) {
    return false;
  }
  return cachedCode;
}

export function deleteCachedCode(exerciseUUID) {
  localStorage.removeItem(getExerciseCodeKey(exerciseUUID));
}

export function markSeenDiscordSyncInsert() {
  localStorage.setItem(seenDiscordSyncInsertKey, trueString);
}

export function hasSeenDiscordSyncInsert() {
  const val = localStorage.getItem(seenDiscordSyncInsertKey);
  return val === trueString;
}
