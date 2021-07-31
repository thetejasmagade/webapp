<template>
  <div class="playground-root">
    <TopNav :title="`${displayLang} Playground`" />

    <div class="select-container">
      <SelectDropdown
        :options="displayLangsArray"
        :default="displayLangs[lang]"
        class="select"
        @update:modelValue="
          $router.push({ path: `/playground/${displayToKey($event)}` })
        "
      />
    </div>

    <CodeEditor
      v-model="code"
      class="editor"
      :run-callback="() => {}"
      :reset-callback="setCode"
      :prog-lang="progLang"
      :canvas-enabled="lang === 'jsCanvas'"
    />
  </div>
</template>

<script>
import CodeEditor from '@/components/CodeEditor.vue';
import TopNav from '@/components/TopNav.vue';
import SelectDropdown from '@/components/SelectDropdown.vue';

import { reactive, computed, onMounted } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useMeta } from 'vue-meta';

function getCode(lang) {
  if (lang === 'go') {
    return `package main

import "fmt"

func main(){
\tfmt.Println("hello, world")
}

// code is compiled to WASM
// on Qvault's servers then
// executes on your machine
// read about it on my blog:
// https://qvault.io/golang/running-go-in-the-browser-with-web-assembly-wasm`;
  }

  if (lang === 'js') {
    return `
console.log("hello, world")
`;
  }
  if (lang === 'jsCanvas') {
    return `var ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(200, 0, 0)';
ctx.fillRect(100, 100, 500, 500);

ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
ctx.fillRect(300, 300, 500, 500);

console.log("hello, world")

// The canvas will always be 1000x1000 pixels
// for the purpose of drawing. You can
// resize your screen and the canvas will grow/shrink
// and stretch the image, it won't change your logic.
`;
  }
  if (lang === 'py') {
    return `print("hello, world")

# We use a Python interpreter that's compiled to Web Assembly
# to run code right in your browser using a Web Worker
# read about it on my blog: 
# https://qvault.io/python/running-python-in-the-browser-with-web-assembly
        `;
  }
  if (lang === 'purs') {
    return `module Main where

import Prelude

import Effect.Console (logShow)

main = do
  logShow "hello, world"
`;
  }
  return 'unknown language';
}

export default {
  components: {
    SelectDropdown,
    TopNav,
    CodeEditor
  },
  setup() {
    const route = useRoute();

    const state = reactive({
      code: '',
      lang: route.params.lang,
      displayLangs: {
        go: 'Golang',
        js: 'JavaScript',
        jsCanvas: 'JavaScript Canvas',
        py: 'Python',
        purs: 'PureScript'
      },
      displayLang: '',
      displayLangsArray: [],
      progLang: ''
    });

    const computedMeta = computed(() => {
      const description = `Run ${state.displayLang} code in the browser. Execute your scripts in a sandboxed playground. Take courses to learn to write code and earn achievements to show off your skills.`;
      const featuredImage =
        'https://qvault.io/wp-content/uploads/2021/04/qvault-coding-playground.jpg';
      const title = `${state.displayLang} Playground`;
      return {
        title: title,
        meta: [
          { vmid: 'description', name: 'description', content: description },

          { vmid: 'og:title', property: 'og:title', content: title },
          {
            vmid: 'og:description',
            property: 'og:description',
            content: description
          },
          { vmid: 'og:image', property: 'og:image', content: featuredImage },

          { vmid: 'twitter:title', name: 'twitter:title', content: title },
          {
            vmid: 'twitter:description',
            property: 'twitter:description',
            content: description
          },
          {
            vmid: 'twitter:image',
            name: 'twitter:image',
            content: featuredImage
          }
        ]
      };
    });
    useMeta(computedMeta);

    state.displayLang = computed(() => {
      return state.displayLangs[state.lang];
    });
    state.displayLangsArray = computed(() => {
      return Object.values(state.displayLangs);
    });
    state.progLang = computed(() => {
      if (state.lang === 'jsCanvas') {
        return 'js';
      }
      return state.lang;
    });

    onMounted(() => {
      state.code = getCode(state.lang);
    });

    onBeforeRouteUpdate((to, from, next) => {
      state.lang = to.params.lang;
      state.code = getCode(state.lang);
      next();
    });

    state.setCode = () => {
      state.code = getCode(state.lang);
    };
    state.displayToKey = (displayName) => {
      return Object.keys(state.displayLangs).find(
        (key) => state.displayLangs[key] === displayName
      );
    };

    return state;
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/consts.scss";

.playground-root {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  background-color: $gray-lighter;

  .langs {
    display: flex;
    flex-direction: row;
    padding: 1em;

    a {
      padding-left: 10px;
    }
  }

  .editor {
    flex: 1;
    background-color: $gray-lightest;
    max-height: 100%;
    overflow: auto;
  }

  .select-container {
    z-index: 5;
    @media screen and (max-width: $mobile-size) {
      display: flex;
      justify-content: flex-end;
      flex-direction: row;
      margin: 1em;
      justify-content: center;
    }
    @media screen and (min-width: $mobile-size) {
      display: block;
      top: calc(6px + #{$bar-height});
      right: 20px;
      position: absolute;
    }
  }

  .select {
    @media screen and (max-width: $mobile-size) {
      max-width: 100%;
    }
    @media screen and (min-width: $mobile-size) {
      width: auto;
      min-width: 250px;
    }
  }
}
</style>
