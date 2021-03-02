<template>
  <div class="playground-root">
    <TopNav :title="`${displayLang} Playground`" />

    <div class="select-container">
      <SelectDropdown
        :options="displayLangsArray"
        :default="displayLangs[lang]"
        class="select"
        @input="$router.push({path: `/playground/${displayToKey($event)}` })"
      />
    </div>

    <CodeEditor
      v-model="code"
      class="editor"
      :run-callback="() => {}"
      :reset-callback="setCode"
      :prog-lang="lang"
    />
  </div>
</template>

<script>
import CodeEditor from '@/components/CodeEditor';
import TopNav from '@/components/TopNav';
import SelectDropdown from '@/components/SelectDropdown';

export default {
  metaInfo() {
    const description = `Run ${this.displayLang} code in the browser. Execute your scripts in a sandboxed playground. Take courses to learn to write code and earn achievements to show off your skills.`;
    const featuredImage = 'https://qvault.io/wp-content/uploads/2020/09/Site-Social-Image-3.png';
    const title = `${this.displayLang} Playground - Qvault`;
    return {
      title: title,
      meta: [
        { vmid:'description', name: 'description', content: description },

        { vmid:'og:title', property: 'og:title', content: title },
        { vmid:'og:description', property: 'og:description', content: description },
        { vmid:'og:image', property: 'og:image', content: featuredImage },

        { vmid:'twitter:title', name: 'twitter:title', content: title },
        { vmid:'twitter:description', property: 'twitter:description', content: description },
        { vmid:'twitter:image', name: 'twitter:image', content: featuredImage }
      ]
    };
  },
  components: {
    SelectDropdown,
    TopNav,
    CodeEditor
  },
  beforeRouteUpdate (to, from, next) {
    this.lang = to.params.lang;
    this.setCode();
    next();
  },
  data(){
    return {
      code: '',
      lang: this.$route.params.lang,
      displayLangs: {
        go: 'Go - Web Assembly',
        js: 'JavaScript',
        py: 'Python - Web Assembly',
        purs: 'PureScript'
      }
    };
  },
  computed: {
    displayLang(){
      return this.displayLangs[this.lang];
    },
    displayLangsArray(){
      return Object.values(this.displayLangs);
    }
  },
  mounted(){
    this.setCode();
  },
  methods:{
    displayToKey(displayName){
      return Object.keys(this.displayLangs).find(key => this.displayLangs[key] === displayName);
    },
    setCode(){
      if (this.lang === 'go'){
        this.code = `package main

import "fmt"

func main(){
\tfmt.Println("hello, world")
}

// code is compiled to WASM
// on our servers then
// executes on your machine
// read about it on our blog:
// https://qvault.io/2020/07/01/running-go-in-the-browser-with-web-assembly-wasm/`;
        
        return;
      }
      if (this.lang === 'js'){
        this.code = `
console.log("hello, world")
`;
        return;
      }
      if (this.lang === 'py'){
        this.code = `print("hello, world")

# We use a Python interpreter that's compiled to Web Assembly
# to run code right in your browser using a Web Worker
# read about it on our blog: 
# https://qvault.io/2020/09/24/running-python-in-the-browser-with-web-assembly/
        `;
        return;
      }
      if (this.lang === 'purs'){
        this.code = `module Main where

import Prelude

import Effect.Console (logShow)

main = do
  logShow "hello, world"
`;
        return;
      }
      this.code = 'unknown language';
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.playground-root {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  background-color: $gray-darker;

  .langs{
    display: flex;
    flex-direction: row;
    padding: 1em;
    
    a {
      padding-left: 10px;
    }
  }

  .editor {
    flex: 1;
    background-color: $gray-darker;
    color: $gray-lighter;
    max-height: 100%;
    overflow: auto;
  }

  .select-container{
    @media screen and (max-width: $mobile-size) {
      display: flex;
      justify-content: flex-end;
      flex-direction: row;
      margin: 1em;
      justify-content: center;
    }
    @media screen and (min-width: $mobile-size) {
      display: block;
      top: calc(10px + #{$bar-height});
      right: 10px;
      position: absolute;
      z-index: 5;
    }
  }

  .select {
    @media screen and (max-width: $mobile-size) {
      max-width: 100%;
    }
    @media screen and (min-width: $mobile-size) {
      width: 250px;
    }
  }
}
</style>
