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

  postMessage({
    done: true
  });
}, false);
