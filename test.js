// const { random_string } = require("./utils/random_string.js");

// console.log(JSON.stringify({
//     id: random_string(50)
// }));


const axios = require("axios");

(async() =>{
    const response = axios.post('/api/test/chi_test_post', {
        text: "asdasdasdasdas"
    }, {
        headers: {
          'Content-Type': 'application/json'
        }
    });

    console.log()
})();