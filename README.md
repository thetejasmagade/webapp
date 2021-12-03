# webapp

Qvault's web app frontend - https://app.qvault.io

[![Netlify Status](https://api.netlify.com/api/v1/badges/1e61fa8a-eb49-4d5b-96e0-b1696a617e58/deploy-status)](https://app.netlify.com/sites/qvaultclassroom/deploys) ![Tests](https://github.com/qvault/webapp/workflows/Tests/badge.svg)

## 🚀 Quick Start

Use the proper version of node:

```bash
nvm use
```

Install deps:

```bash
yarn serve
```

Run the dev server:

```bash
yarn serve
```

## Recommended VS Code Settings

Settings in `.vscode/settings.json`

```json
{
  "files.eol": "\n",
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "eslint.options": {
    "configFile": ".eslintrc.json"
  },
  "eslint.alwaysShowStatus": true,
  "eslint.format.enable": true,
  "eslint.packageManager": "yarn",
  "css.customData": [
    ".vscode/css_custom_data.json"
  ]
}
```

Plugins:

* ESLint by Microsoft
* Vetur by Pine Wu
* YAML by Red Hat
* Tailwind CSS IntelliSense by Tailwind Labs
