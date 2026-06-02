// eslint.config.js — DocReady (ESLint v9 flat config)
export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        alert: "readonly",
        confirm: "readonly",
        location: "readonly",
        history: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        HTMLElement: "readonly",
        Node: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-console": "off",
      "eqeqeq": "warn",
      "no-var": "warn",
      "prefer-const": "warn",
    },
  },
];
