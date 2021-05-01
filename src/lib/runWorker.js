export function getWorker(lang, canvasElement) {

  const worker = new window.Worker(`/${lang}_worker.js`);

  if (canvasElement){
    const offscreenControl = canvasElement.transferControlToOffscreen();
    worker.postMessage(
      {
        type: 'canvas',
        canvas: offscreenControl,
        pixelRatio: window.devicePixelRatio
      },
      [ offscreenControl ]
    );
  }

  return {
    webWorker: worker,
    lang
  };
}

export function useWorker(worker, params, callback) {
  const promise = new Promise((resolve, reject) => {
    worker.webWorker.onmessage = (event) => {
      if (event.data.done) {
        resolve({hash: event.data.encodedHash});
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
