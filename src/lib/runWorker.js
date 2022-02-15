export function getWorker(lang, canvasElement) {
  const worker = new window.Worker(`/${lang}_worker.js`);
  if (canvasElement) {
    if (!canvasElement.transferControlToOffscreen) {
      throw "You're browser doesn't support canvas assignments, try a chrome-based browser or just skip this exercise";
    }
    const offscreenControl = canvasElement.transferControlToOffscreen();
    worker.postMessage(
      {
        type: "SETUP_CANVAS",
        canvas: offscreenControl,
        pixelRatio: window.devicePixelRatio,
      },
      [offscreenControl]
    );
  }

  return {
    webWorker: worker,
    lang,
  };
}

export function awaitWorkerReady(worker) {
  const promise = new Promise((resolve, reject) => {
    worker.webWorker.onmessage = (event) => {
      if (event.data.ready) {
        resolve();
        return;
      }
      if (event.data.error) {
        reject(event.data.error);
        return;
      }
    };
  });
  worker.webWorker.postMessage({ type: "WORKER_READY" });
  return promise;
}

export function useWorker(worker, code, callback) {
  const promise = new Promise((resolve, reject) => {
    worker.webWorker.onmessage = (event) => {
      if (event.data.done) {
        resolve({ hash: event.data.encodedHash });
        return;
      }
      if (event.data.error) {
        reject(event.data.error);
        return;
      }
      callback(event.data.message);
    };
  });
  worker.webWorker.postMessage({ type: "EXEC_CODE", code });
  return promise;
}

export function terminateWorker(worker) {
  worker.webWorker.terminate();
}
