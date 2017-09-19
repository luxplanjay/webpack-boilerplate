module.exports = {
  "extends": "airbnb-base",
  "parser": "babel-eslint",
  "rules": {
    "max-len": [1, 100, 2, {ignoreComments: true}],
    "quote-props": [1, "consistent-as-needed"],
    "no-unused-vars": [2, {"args": "none"}],
    "radix": 0,
    "func-names": ["error", "never"],
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "webpack.config.js"
      }
    }
  }
};
