function send(line){
  postMessage({
    message: readString(line)
  });
}

// keep a WebAssembly memory reference for `readString`
let memory;

// read a null terminated c string at a wasm memory buffer index
function readString(ptr) {
  const view = new Uint8Array(memory.buffer);

  let end = ptr;
  while (view[end]) ++end;

  const buf = new Uint8Array(view.subarray(ptr, end));
  return (new TextDecoder()).decode(buf);
}

addEventListener('message', async (e) => {
  const result = await WebAssembly.instantiate(e.data, {
    env: {
      print(ptr){
        send(ptr);
      },
      eprint(ptr) {
        send(ptr);
      },
      trace(ptr) {
        send(ptr);
      }
    }
  });
  memory = result.instance.exports.memory;
  console.log(result.instance.exports);
  await result.instance.exports.main();
  postMessage({
    done: true
  });
}, false);
  
