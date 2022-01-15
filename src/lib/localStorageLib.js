const jwtKey = 'cloudJWT';

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
