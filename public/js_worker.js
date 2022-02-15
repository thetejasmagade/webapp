function prepareToPrint(obj) {
  if (typeof obj === "object") {
    return JSON.stringify(obj);
  }
  return obj;
}
// globally accessible canvas element
let canvas;
let ctx;

function awaitAnimationFrame() {
  let resolve = null;
  const promise = new Promise((r) => (resolve = r));
  requestAnimationFrame(resolve);
  return promise;
}

function seededRandom(seed) {
  seed = seed & 0xffffffff;
  seed = (seed + 0x7ed55d16 + (seed << 12)) & 0xffffffff;
  seed = (seed ^ 0xc761c23c ^ (seed >>> 19)) & 0xffffffff;
  seed = (seed + 0x165667b1 + (seed << 5)) & 0xffffffff;
  seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
  seed = (seed + 0xfd7046c5 + (seed << 3)) & 0xffffffff;
  seed = (seed ^ 0xb55a4f09 ^ (seed >>> 16)) & 0xffffffff;
  return (seed & 0xfffffff) / 0x10000000;
}

function getFrameSum(colorData) {
  let sum = 0;
  let i = 0;
  const multiplierRange = canvas.width * canvas.height;
  for (const colorRgb of colorData) {
    const multiplier = Math.floor(seededRandom(i) * multiplierRange);
    sum += colorRgb * multiplier;
    i++;
  }
  const maxInt64 = 9223372036854775807;
  return sum % maxInt64;
}

async function getEncodedHash(canvas, ctx) {
  let encodedHash = 0;
  const framesToHash = 3;
  const framesBetween = 10;
  if (canvas && ctx) {
    for (let i = 0; i < framesToHash; i++) {
      const imageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      encodedHash += getFrameSum(imageData.data);
      for (let j = 0; j < framesBetween; j++) {
        await awaitAnimationFrame();
      }
    }
  }
  return encodedHash;
}

addEventListener(
  "message",
  async (e) => {
    if (e.data.type === "SETUP_CANVAS") {
      canvas = e.data.canvas;
      return;
    }

    if (e.data.type === "WORKER_READY") {
      postMessage({
        ready: true,
      });
      return;
    }

    if (e.data.type !== "EXEC_CODE") {
      throw "bad data type in worker";
    }

    if (canvas) {
      if (!ctx) {
        ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
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
        const printables = lines.map((line) => prepareToPrint(line));
        postMessage({
          message: printables.join(" "),
        });
      };
      try {
        await newFunc();
      } catch (err) {
        postMessage({
          error: `${err}`,
        });
        console.log = oldLog;
        return;
      }
      console.log = oldLog;
    } catch (err) {
      postMessage({
        error: `${err}`,
      });
      return;
    }

    const encodedHash = await getEncodedHash(canvas, ctx);
    console.log("encodedHash: ", encodedHash);

    postMessage({
      done: true,
      encodedHash,
    });
  },
  false
);
