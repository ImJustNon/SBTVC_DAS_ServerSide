const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});

router.post('/api/test/chi_test_post', urlEncoded, (req, res) =>{
    const { text } = req.body ?? {};

    if(!text){
        return res.json({
            status: "FAIL",
            error: "ส่ง params 'text' มาด้วยสัส"
        }); 
    }
    
    return res.json({
        status: "SUCCESS",
        error: null,
        data: {
            success: true,
            text: text,
        }
    });
});

module.exports = router;