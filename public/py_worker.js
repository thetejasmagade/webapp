importScripts('https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js');

// https://pyodide.org/en/stable/usage/webworker.html
async function loadPyodideAndPackages() {
  self.pyodide = await self.loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/'
  });
}
let pyodideReadyPromise = loadPyodideAndPackages();

// globally accessible canvas element
let canvas;

addEventListener('message', async (e) => {
  if (e.data.type === 'SETUP_CANVAS') {
    canvas = e.data.canvas;
    return;
  }

  await pyodideReadyPromise;

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
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  self.runCode = () => {
    try {
      self.pyodide.runPython(e.data.code);
    } catch (err){
      postMessage({
        error: `${err}`
      });
      return;
    }
  };

  self.writeStdOut = (stdout) => {
    stdout = stdout.split('\n');
    for (const line of stdout){
      if (!line){
        continue;
      }
      postMessage({
        message: line
      });
    }
  };

  self.pyodide.runPython(`
    import io, code, sys
    from js import writeStdOut, runCode
    
    class StdoutFile():
        def __init__ (self, fileObj):
            self.file = fileObj

        def write (self, s):
            writeStdOut(s)
    
    f1 = StdoutFile(io.StringIO())
    f2 = StdoutFile(io.StringIO())
    sys.stdout = f1
    sys.stderr = f2
    runCode()
  `);

  let encodedHash;
  postMessage({
    done: true,
    encodedHash
  });
}, false);
