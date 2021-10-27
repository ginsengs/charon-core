module.exports = {
    "extends": [
        "airbnb-typescript",
        "plugin:jest/recommended",
        "plugin:import/typescript"
    ],
    "plugins": [
        "@typescript-eslint",
        "jest"
    ],
    "parser": "@typescript-eslint/parser",
    "rules": {
        "react/require-default-props": "off",
        "arrow-parens": "off",
        "jest/no-export": "off",
        "jest/no-test-callback": "off",
        "max-classes-per-file": "off",
        "no-useless-constructor": "off",
        "@typescript-eslint/no-useless-constructor": "error",
        // @TODO: Determine how dependencies should be sorted in our project.
        "import/no-extraneous-dependencies": [
            "error",
            {devDependencies: true},
        ],
        // "complexity": [ "error", 2 ]
    },
    "env": {
        "node": true
    },
};