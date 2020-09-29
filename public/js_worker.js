function prepareToPrint(obj) {
  if (typeof obj === 'object'){
    return JSON.stringify(obj);
  }
  return obj;
}

addEventListener('message', async (e) => {
  try {
    const newFunc = new Function(`
    let wholeCode = async function () {
        ${e.data}
    };
    return wholeCode();
    `);

    let oldLog = console.log;
    console.log = (line) => {
      postMessage({
        message: prepareToPrint(line)
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

  postMessage({
    done: true
  });
}, false);
