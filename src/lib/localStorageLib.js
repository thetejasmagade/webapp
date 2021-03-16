const jwtKey = 'cloudJWT';

function unsubscribedProgressKey(courseUUID){
  return `unsubscribedProgress-${courseUUID}`;
}

export function saveUnsubscribedProgress(courseUUID, currentExerciseUUID){
  localStorage.setItem(
    unsubscribedProgressKey(courseUUID),
    currentExerciseUUID
  );
}

export function loadUnsubscribedProgress(courseUUID){
  const exerciseUUID = localStorage.getItem(
    unsubscribedProgressKey(courseUUID)
  );
  if (!exerciseUUID){
    throw 'no progress found';
  }
  return exerciseUUID;
}

export function saveCloudJWT(token){
  localStorage.setItem(
    jwtKey,
    token
  );
}

export function loadCloudJWT(){
  const token = localStorage.getItem(
    jwtKey
  );
  if (!token){
    throw 'no progress found';
  }
  return token;
}

export function removeCloudJWT(){
  localStorage.removeItem(
    jwtKey
  );
}
