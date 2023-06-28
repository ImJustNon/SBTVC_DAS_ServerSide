const express = require("express");
const router = express.Router();
const { connection } = require("../database/connect.js");
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});

router.post("/api/login/save_login_history", urlEncoded, async(req, res) =>{
    const { student_id, client_ip } = req.body ?? {};

    if(!student_id || !client_ip){
        return res.json({
            status: "FAIL",
            error: "You have to provide 'student_id' and 'client_ip' json",
        });
    }

    const timestamp = new Date().getTime();

    connection.execute('INSERT INTO login_history_table (student_id,client_ip,timestamp) VALUES (?,?,?)', [student_id, client_ip, String(timestamp)], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                error: `Cant insert to mysql table : ERROR : ${err}`,
            });
        }

        return res.json({
            status: "SUCCESS",
            error: null,
            data: {
                student_id: student_id,
                client_ip: client_ip,
                timestamp: timestamp,
            },
        });
    });
});

module.exports = router;