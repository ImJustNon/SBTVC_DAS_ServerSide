const { random_string } = require("./utils/random_string.js");

console.log(JSON.stringify({
    id: random_string(50)
}));