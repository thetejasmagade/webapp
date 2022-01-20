function prepareToPrint(obj) {
  if (typeof obj === 'object'){
    return JSON.stringify(obj);
  }
  return obj;
}
// globally accessible canvas element
let canvas;
let ctx;

function awaitAnimationFrame() {
  let resolve = null;
  const promise = new Promise(r => resolve = r);
  requestAnimationFrame(resolve);
  return promise;
}

function getFrameSum(colorData){
  let sum = 0;
  for (const colorRgb of colorData){
    sum += colorRgb;
  }
  const maxSafe = 2147483647;
  return sum % maxSafe;
}

async function getEncodedHash(canvas, ctx){
  let encodedHash = 0;
  const framesToHash = 3;
  const framesBetween = 10;
  if (canvas && ctx){
    for (let i = 0; i < framesToHash; i++){
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      encodedHash += getFrameSum(imageData.data);
      for (let j = 0; j < framesBetween; j++){
        await awaitAnimationFrame();
      }
    }
  }
  return encodedHash;
}

addEventListener('message', async (e) => {
  if (e.data.type === 'SETUP_CANVAS') {
    canvas = e.data.canvas;
    return;
  }

  if (e.data.type === 'WORKER_READY') {
    postMessage({
      ready: true
    });
    return;
  }

  if (e.data.type !== 'EXEC_CODE') {
    throw 'bad data type in worker';
  }

  if (canvas){
    if (!ctx) {
      ctx = canvas.getContext('2d');
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  try {
    const newFunc = new Function(`
    let wholeCode = async function () {
      ${e.data.code}
    };
    return wholeCode();
    `);

    let oldLog = console.log;
    console.log = (...lines) => {
      const printables = lines.map(line => prepareToPrint(line));
      postMessage({
        message: printables.join(' ')
      });
    };
    try {
      await newFunc();
    } catch (err) {
      postMessage({
        error: `${err}`
      });
      return;
    }
    console.log = oldLog;
  } catch (err) {
    postMessage({
      error: `${err}`
    });
    return;
  }

  const encodedHash = await getEncodedHash(canvas, ctx);
  console.log('encodedHash: ', encodedHash);

  postMessage({
    done: true,
    encodedHash
  });
}, false);

