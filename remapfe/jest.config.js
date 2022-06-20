// jest.config.js


module.exports = {
    // [...]
    "transform": {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    "transformIgnorePatterns": [
        "node_modules/(?!react-leaflet|@react-leaflet/)"
    ],
    testEnvironment: 'jsdom'
};