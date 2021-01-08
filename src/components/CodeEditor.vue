<template>
  <div>
    <div class="code-editor-root">
      <LoadingOverlay
        :is-loading="isLoading"
        :cancel="cancelCode"
      />
      <div class="editor-container">
        <PrismEditor
          v-model="code"
          class="my-editor"
          :language="progLang"
          line-numbers
          :tab-size="tabSize"
          :insert-spaces="insertSpaces"
          :highlight="highlighter"
          @input="onInput"
        />
      </div>
      <div
        ref="consoleOutput"
        class="console-output"
      >
        <div class="btns">
          <Tooltip
            :text="`Run Code`"
            position="right"
          >
            <BlockButton
              class="btn"
              :click="runCode"
            >
              <FontAwesomeIcon
                icon="play"
              />
            </BlockButton>
          </Tooltip>
          <Tooltip
            v-if="saveCallback"
            :text="`Save Code`"
            position="right"
            class="bottom"
          >
            <BlockButton
              class="btn"
              :click="saveCallback"
              color="green"
            >
              <FontAwesomeIcon
                icon="save"
              />
            </BlockButton>
          </Tooltip>
          <Tooltip
            v-if="loadCallback"
            :text="`Load Last Save`"
            position="right"
            class="bottom"
          >
            <BlockButton
              class="btn"
              :click="loadCallback"
              color="gray"
            >
              <FontAwesomeIcon
                icon="backward"
              />
            </BlockButton>
          </Tooltip>
          <Tooltip
            :text="`Reset Exercise`"
            position="right"
            class="bottom"
          >
            <BlockButton
              class="btn"
              :click="runReset"
              color="gray"
            >
              <FontAwesomeIcon
                icon="undo"
              />
            </BlockButton>
          </Tooltip>
        </div>
        <div class="output">
          <p
            v-for="(line, i) of output"
            :key="i"
            :class="{error: err}"
            class="pre"
          >
            {{ line }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-haskell.js'; // required for purescript
import 'prismjs/components/prism-purescript.js';
import 'prismjs/components/prism-python.js';

// should match any other prism components that share a page
import 'prismjs/themes/prism-okaidia.css';

import { getWorker, useWorker, terminateWorker } from '@/lib/runWorker.js';
import { 
  compileGo,
  compilePureScript
} from '@/lib/cloudClient.js';

import { 
  sleep
} from '@/lib/sleep.js';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import BlockButton from '@/components/BlockButton';
import LoadingOverlay from '@/components/LoadingOverlay';
import Tooltip from '@/components/Tooltip';


export default {
  components: {
    PrismEditor,
    FontAwesomeIcon,
    LoadingOverlay,
    BlockButton,
    Tooltip
  },
  props: {
    runCallback: {
      type: Function,
      required: true
    },
    resetCallback: {
      type: Function,
      required: true
    },
    saveCallback: {
      type: Function,
      required: false,
      default: null
    },
    loadCallback: {
      type: Function,
      required: false,
      default: null
    },
    progLang: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      code: this.value,
      output: [],
      err: false,
      isLoading: false,
      worker: getWorker(this.getWorkerLang(this.progLang))
    };
  },
  computed: {
    tabSize(){
      if (this.progLang === 'go'){
        return 1; // because its a tab
      }
      if (this.progLang === 'py'){
        return 4;
      }
      return 2;
    },
    insertSpaces(){
      return this.progLang === 'js' || 
        this.progLang === 'purs' ||
        this.progLang === 'py';
    }
  },
  watch: { 
    progLang(newLang) {
      terminateWorker(this.worker);
      this.worker = getWorker(this.getWorkerLang(newLang));
    },
    value(newValue) {
      this.code = newValue;
    }
  },
  methods: {
    onInput() {
      // this.currentValue is a string because HTML is weird
      this.$emit('input', this.code);
    },
    getWorkerLang(progLang){
      if (progLang === 'purs'){
        return 'js';
      }
      return progLang;
    },
    scrollToEnd () {
      requestAnimationFrame(() => {
        var content = this.$refs.consoleOutput;
        content.scrollTop = Number.MAX_SAFE_INTEGER;
      });
    },
    highlighter(code) {
      return highlight(code, languages[this.progLang]);
    },
    cancelCode(){
      this.isLoading = false;
      terminateWorker(this.worker);
      this.worker = getWorker(this.getWorkerLang(this.progLang));
      this.output.push('code execution cancelled');
      this.err = true;
    },
    async runCode() {
      try {
        this.output = [];
        this.isLoading = true;

        if (this.progLang === 'go'){
          try {
            const wasm = await compileGo(this.code);
            await useWorker(this.worker, wasm, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          } catch (err){
            await this.runCallback(err);
            throw err;
          }
        }  else if (this.progLang === 'purs'){
          try {
            const resp = await compilePureScript(this.code);
            await useWorker(this.worker, resp.Code, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          } catch (err){
            await this.runCallback(err);
            throw err;
          }
        } else if (this.progLang === 'js'){
          // make it feel like something is running
          await sleep(250);
          try {
            await useWorker(this.worker, this.code, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          } catch (err){
            await this.runCallback(JSON.stringify(err));
            throw err;
          }
        } else if (this.progLang === 'py'){
          await sleep(250);
          try {
            await useWorker(this.worker, this.code, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          } catch (err){
            await this.runCallback(JSON.stringify(err));
            throw err;
          }
        }

        this.err = false;
        this.isLoading = false;
        let finalOut = '';
        for (const line of this.output){
          if (Array.isArray(line) || typeof line === 'object'){
            finalOut += JSON.stringify(line);
          } else{
            finalOut+=line;
          }
        }
        await this.runCallback(finalOut);
      } catch(err) {
        this.isLoading = false;

        let errString = err;
        if (typeof err !== 'string'){
          errString = err.toString();
        }

        const errLines = errString.split(/\r?\n/);

        this.output = errLines;
        this.err = true;
      }
    },
    async runReset() {
      try {
        await this.resetCallback(this.output.join(''));
      } catch(err) {
        this.output = null;
        this.err = false;
      }
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/colors.scss';

span.token.operator {
  background: inherit !important;
}

.pre {
  white-space: pre;
}

.my-editor {
  font-size: 14px;
  line-height: 1.5;

  .prism-editor__textarea:focus {
    outline: none;
  }
}

.code-editor-root {
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .editor-container {
    flex: 4;
    overflow: auto;
    margin: 10px 0 0 0;
  }

  .console-output {
    font-size: 14px;
    background-color: $gray-darker-2;
    flex: 2;
    display: flex;
    flex-direction: row;
    padding: 10px;
    overflow: auto;
    border-top: solid 1px $gray-light;

    .btns {
      display: flex;
      flex-direction: column;

      .bottom {
        margin: 1em 0 0 0;
      }
    }

    .btn {
      font-size: 1em;
      width: 100%;
    }

    .output {
      padding: 0 1em 0 1em;
    }

    p {
      margin: 0;
      font-size: 1em;
      color: $white;
    }

    .error {
      color: $pink-light;
    }
  }
}

</style>
