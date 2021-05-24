# webapp

Qvault's web app frontend - https://app.qvault.io

[![Netlify Status](https://api.netlify.com/api/v1/badges/1e61fa8a-eb49-4d5b-96e0-b1696a617e58/deploy-status)](https://app.netlify.com/sites/qvaultclassroom/deploys) ![Tests](https://github.com/qvault/webapp/workflows/Tests/badge.svg)

## 🚀 Quick Start

To run locally while connecting to the production backend:

```bash
yarn install
yarn serve
```

## 💬 Contact

[![Twitter Follow](https://img.shields.io/twitter/follow/q_vault.svg?label=Follow%20Qvault&style=social)](https://twitter.com/intent/follow?screen_name=q_vault)

Submit an issue (above in the issues tab)

## 👏 Contributing

We love help! Contribute by forking the repo and opening pull requests. Please ensure that your code passes the existing linting.

All pull requests should be submitted to the `master` branch.

```bash
yarn lint
```

## VS Code Settings

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

```json
{
  "atDirectives": [
    {
      "name": "@tailwind",
      "description": "Use the @tailwind directive to insert Tailwind’s `base`, `components`, `utilities`, and `screens` styles into your CSS.",
      "references": [
        {
          "name": "Tailwind’s “Functions & Directives” documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives/#tailwind"
        }
      ]
    },
    {
      "name": "@layer",
      "description": "Use the @tailwind directive to insert Tailwind’s `base`, `components`, `utilities`, and `screens` styles into your CSS.",
      "references": [
        {
          "name": "Tailwind’s “Functions & Directives” documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives/#tailwind"
        }
      ]
    }
  ]
}
```
