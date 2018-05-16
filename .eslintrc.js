module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true
    },
    "extends": ["eslint:recommended", "airbnb"],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "jest"
    ],
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [".js"]
            }
        }
    },
    "rules": {
        "function-paren-newline": ["error", "consistent"],
        "no-plusplus": "off",
        "no-nested-ternary": "off",
        "import/no-extraneous-dependencies": [
            "error",
            {
              "devDependencies": true,
              "optionalDependencies": false,
              "peerDependencies": true,
            }
        ],
    }
};
