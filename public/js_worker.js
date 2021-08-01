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

function getHash(toHash) {
  var hash = 0;
  if (toHash.length == 0) {
    return hash;
  }
  for (var i = 0; i < toHash.length; i++) {
    var char = toHash.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

addEventListener('message', async (e) => {
  if (e.data.type === 'canvas') {
    canvas = e.data.canvas;
    return;
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
      ${e.data}
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
      // firefox requires a copy
      const errCopy = err + '';
      postMessage({
        error: errCopy
      });
      return;
    }
    console.log = oldLog;
  } catch (err) {
    // firefox requires a copy
    const errCopy = err + '';
    postMessage({
      error: errCopy
    });
    return;
  }

  let encodedHash;
  const framesToHash = 3;
  const framesBetween = 10;
  for (let i = 0; i < framesToHash; i++){
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const imageDataText = new TextDecoder().decode(imageData.data);
    encodedHash = getHash(imageDataText + encodedHash);
    for (let j = 0; j < framesBetween; j++){
      await awaitAnimationFrame();
    }
  }
  console.log('canvas hash :', encodedHash);

  postMessage({
    done: true,
    encodedHash
  });
}, false);

/*
Animation example

var canvasWidth = 1000;
var canvasHeight = 1000;

var angle = 0;
 
function drawCircle() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
  // color in the background
  ctx.fillStyle = "#EEEEEE";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
  // draw the circle
  ctx.beginPath();
    
  var radius = 25 + 150 * Math.abs(Math.cos(angle));
  ctx.arc(225, 225, radius, 0, Math.PI * 2, false);
  ctx.closePath();
    
  // color in the circle
  ctx.fillStyle = "#006699";
  ctx.fill();
    
  angle += Math.PI / 64;
    
  requestAnimationFrame(drawCircle);
}

drawCircle();
*/
