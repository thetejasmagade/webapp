function prepareToPrint(obj) {
  if (typeof obj === 'object'){
    return JSON.stringify(obj);
  }
  return obj;
}

// globally accessible canvas element
let canvas;

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
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
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
      postMessage({
        error: err
      });
      return;
    }
    console.log = oldLog;
  } catch (err) {
    postMessage({
      error: err
    });
    return;
  }

  let encodedHash;
  if (canvas){
    const canvasBlob = await canvas.convertToBlob();
    const encodedImage = await canvasBlob.text();
    encodedHash = getHash(encodedImage);
    console.log('canvas hash:', encodedHash);
  }

  postMessage({
    done: true,
    encodedHash
  });
}, false);
