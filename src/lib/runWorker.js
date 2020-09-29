export function getWorker(lang) {
  return {
    webWorker: new window.Worker(`/${lang}_worker.js`),
    lang
  };
}

export function useWorker(worker, params, callback) {
  const promise = new Promise((resolve, reject) => {
    worker.webWorker.onmessage = (event) => {
      if (event.data.done) {
        resolve();
        return;
      }
      if (event.data.error) {
        reject(event.data.error);
        return;
      }
      callback(event.data.message);
    };
  });
  worker.webWorker.postMessage(params);
  return promise;
}

export function terminateWorker(worker) {
  worker.webWorker.terminate();
}
