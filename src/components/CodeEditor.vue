<template>
  <div>
    <LoadingOverlay
      :is-loading="isLoading"
      :cancel="cancelCode"
    />
    <ConfirmModal
      ref="loadLastSaveModal"
      heading="Want to load your last save for this exercise?"
      text="
      This will overwrite the code you have in your editor currently.
      "
      :on-confirm="loadCallback"
    />

    <ConfirmModal
      ref="resetCodeModal"
      heading="Want to reset your code to the starting point for this exercise?"
      text="
      This will overwrite the code you have in your editor currently.
      "
      :on-confirm="runReset"
    />
    <div class="code-editor-root">
      <Multipane layout="vertical">
        <div class="top-bar">
          <ConsoleButtons
            :run-callback="runCode"
            :reset-callback="() => $refs.resetCodeModal.show()"
            :save-callback="saveCallback"
            :load-callback="() => $refs.loadLastSaveModal.show()"
            :upgrade-callback="upgradeCallback"
            class="console-buttons"
          />
        </div>
        <div class="editor-container">
          <CodeMirrorWrapper
            v-model="modelValue"
            class="h-full"
            :options="codeMirrorOptions"
          />
        </div>
        <MultipaneResizer layout="vertical" />
        <div
          ref="console"
          class="console bg-gray-800 text-gray-200"
        >
          <Multipane layout="horizontal">
            <canvas
              v-if="canvasAllowed"
              id="canvas"
              ref="canvas"
              height="1000"
              width="1000"
            />
            <MultipaneResizer layout="horizontal" />
            <div class="log">
              <p
                v-for="(line, i) of output"
                :key="i"
                :class="{error: err}"
                class="pre"
              >{{ line }}</p>
            </div>
          </Multipane>
        </div>
      </Multipane>
    </div>
  </div>
</template>

<script>import { getWorker, useWorker, terminateWorker } from '@/lib/runWorker.js';
import { 
  compileGo,
  compilePureScript
} from '@/lib/cloudClient.js';

import { 
  sleep
} from '@/lib/sleep.js';

import ConfirmModal from '@/components/ConfirmModal.vue';
import CodeMirrorWrapper from '@/components/CodeMirrorWrapper.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import ConsoleButtons from '@/components/ConsoleButtons.vue';
import Multipane from '@/components/Multipane.vue';
import MultipaneResizer from '@/components/MultipaneResizer.vue';

import { notify } from '@/lib/notification.js';

export default {
  components: {
    LoadingOverlay,
    ConsoleButtons,
    Multipane,
    MultipaneResizer,
    CodeMirrorWrapper,
    ConfirmModal
  },
  emits: [ 'update:modelValue' ],
  props: {
    canvasEnabled: {
      type: Boolean,
      required: false,
      default: false
    },
    runCallback: {
      type: Function,
      required: false,
      default: ()=>{}
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
    upgradeCallback: {
      type: Function,
      required: false,
      default: null
    },
    progLang: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      output: [],
      err: false,
      isLoading: false,
      worker: null,
      canvasAllowed: this.canvasEnabled
    };
  },
  computed: {
    codeMirrorOptions() {
      return {
        tabSize: this.tabSize,
        indentUnit: this.tabSize,
        mode: this.codeMirrorLang,
        theme: 'darcula',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        styleActiveLine: true
      };
    },
    codeMirrorLang(){
      if (this.progLang === 'go'){
        return 'go';
      }
      if (this.progLang === 'py'){
        return 'python';
      }
      if (this.progLang === 'js'){
        return 'javascript';
      }
      if (this.progLang === 'purs'){
        return 'haskell';
      }
      return 'unknown';
    },
    tabSize(){
      if (this.progLang === 'go' ||
        this.progLang === 'py'){
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
    canvasEnabled(isEnabled) {
      this.canvasAllowed = isEnabled;
      this.$nextTick(() => {
        try {
          this.worker = getWorker(this.getWorkerLang(this.progLang), isEnabled ? this.$refs.canvas : null);
        } catch (err){
          this.canvasAllowed = false;
          notify({
            type: 'danger',
            text: err
          });
        }
      });
    },
    progLang(newLang) {
      terminateWorker(this.worker);
      this.worker = getWorker(this.getWorkerLang(newLang));
    },
    modelValue(newModelValue){
      this.$emit('update:modelValue', newModelValue);
    }
  },
  mounted(){
    try {
      this.worker = getWorker(this.getWorkerLang(this.progLang), this.canvasEnabled ? this.$refs.canvas : null);
    } catch (err){
      this.canvasAllowed = false;
      notify({
        type: 'danger',
        text: err
      });
    }
  },
  methods: {
    getWorkerLang(progLang){
      if (progLang === 'purs'){
        return 'js';
      }
      return progLang;
    },
    scrollToEnd () {
      requestAnimationFrame(() => {
        var content = this.$refs.console;
        content.scrollTop = Number.MAX_SAFE_INTEGER;
      });
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
        let hash = null;

        if (!this.canvasAllowed && this.canvasEnabled){
          notify({
            type: 'danger',
            text: 'You\'re browser doesn\'t support canvas assignments, try a chrome-based browser or just skip this exercise'
          });
          return;
        }

        this.isLoading = true;

        try {
          if (this.progLang === 'go'){
            const wasm = await compileGo(this.modelValue);
            await useWorker(this.worker, wasm, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          }  else if (this.progLang === 'purs'){
            const resp = await compilePureScript(this.modelValue);
            await useWorker(this.worker, resp.Code, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          } else if (this.progLang === 'js'){
          // make it feel like something is running
            await sleep(250);
            let final = await useWorker(this.worker, this.modelValue, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
            hash = final.hash;
          } else if (this.progLang === 'py'){
            await sleep(250);
            await useWorker(this.worker, this.modelValue, (data) => {
              this.output.push(data); 
              this.scrollToEnd();
            });
          }
        } catch (err){
          await this.runCallback({output: JSON.stringify(err)});
          throw err;
        }
        this.err = false;
        this.isLoading = false;
        let finalOut = this.outputToSubmission(this.output);
        await this.runCallback({output: finalOut, hash});
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
    outputToSubmission(output){
      let finalOut = '';
      for (const line of output){
        if (Array.isArray(line) || typeof line === 'object'){
          finalOut += JSON.stringify(line);
        } else{
          finalOut += line;
        }
      }
      return finalOut;
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

.top-bar {
  flex: 0 0 auto;
  border-bottom: solid 1px $gray-light;
  width: 100%;
  padding: 1em;
  box-sizing: border-box;
  background-color: $gray-lighter;
}

.code-editor-root {
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  height: 100%;

  .editor-container {
    height: 65%;
    width: 100%;
    overflow: auto;
  }

  .console {
    font-size: 14px;
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow: auto;
    border-top: solid 1px $gray-dark;
    width: 100%;

    .log {
      margin: 1em;
      .pre {
        white-space: pre-wrap;
        font-size: 1em;
        margin: 0;
      }
      .error {
        color: $pink-light;
      }
    }

    #canvas {
      border: 1px solid $gray-dark;
      background-color: $white;
      margin: 1em 0 1em 1em;
    }
  }
}

</style>
