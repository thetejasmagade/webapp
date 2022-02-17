const jwtKey = "cloudJWT";
const seenSandboxModalLoginKey = "seenSandboxModalLogin";
const seenSandboxModalPatronKey = "seenSandboxModalPatron";
const trueString = "true";

// add the courseUUID to the end
function getSeenCourseDoneModalKey(courseUUID) {
  return `seenCourseDoneModal-${courseUUID}`;
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

export function markSeenCourseDoneModal(courseUUID) {
  const key = getSeenCourseDoneModalKey(courseUUID);
  localStorage.setItem(key, trueString);
}

export function hasSeenCourseDoneModal(courseUUID) {
  const key = getSeenCourseDoneModalKey(courseUUID);
  const val = localStorage.getItem(key);
  return val === trueString;
}
