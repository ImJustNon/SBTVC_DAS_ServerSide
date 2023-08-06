const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.get('/api/users/branch/:branch', async(req, res) =>{
    const { branch } = req.params ?? {};

    if(!branch){
        return res.json({
            status: "FAIL",
            error: `Cant find data for branch ${branch}`
        });
    }

    connection.execute("SELECT * FROM student_data_table WHERE student_reg_type=?", [branch.toUpperCase()], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                error: `mysql error : ERROR : ${err}`
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                error: `Cant find data from this branch :: ${branch}`
            });
        }
        
        return res.json({
            status: "SUCCESS",
            error: null,
            data: {
                results: await results,
            }
        });
    });
});

module.exports = router;