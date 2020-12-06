importScripts('https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js');

addEventListener('message', async (e) => {
  await languagePluginLoader;

  self.runCode = () => {
    try {
      pyodide.runPython(e.data);
    } catch (err){
      postMessage({
        error: err
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


  pyodide.runPython(`
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

  postMessage({
    done: true
  });
}, false);
