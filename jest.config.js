module.exports = {
  preset: "react-native",
  transform: {
    "^.+.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|uuid)/)",
  ],
  testRegex: "(/__tests__/.*|(.|/)(test|spec)).(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
