const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.get('/api/admin/users/:admin_id', async(req, res) =>{
    const { admin_id } = req.params ?? {};

    if(!admin_id){
        return res.json({
            status: "FAIL",
            error: `Cant find 'admin_id' from this request`
        });
    }

    connection.execute("SELECT * FROM admin_data_table WHERE admin_id=?", [admin_id], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                error: `mysql error : ERROR : ${err}`
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                error: `Cant find data from this admin_id :: ${admin_id}`
            });
        }
        
        return res.json({
            status: "SUCCESS",
            error: null,
            data: {
                id: await results[0].id,
                admin_id: await results[0].admin_id,
                admin_prefix: await results[0].admin_prefix,
                admin_name: await results[0].admin_name,
                admin_lastname: await results[0].admin_lastname
            }
        });
    });
});

module.exports = router;