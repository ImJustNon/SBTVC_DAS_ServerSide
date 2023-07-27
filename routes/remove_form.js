const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    extended: true,
    limit: "50mb", 
});
const { connection } = require("../database/connect.js");

router.post("/api/form/remove_form", urlEncoded, async(req, res) =>{
    const { student_id } = req.body ?? {};

    if(!student_id){
        return res.json({
            status: "FAIL",
            error: "Cant find 'student_id'",
        });
    }

    connection.execute(`SELECT * FROM send_form_table WHERE student_id=?`, [student_id], async(error, results, fields) =>{
        if(error){
            return res.json({
                status: "FAIL",
                error: `Mysql error : ${error}`
            });
        }

        // if not found for this student_id
        if(results.length === 0){
            return res.json({
                status: "FAIL",
                error: `Data not found student_id : ${student_id}`,
            });
        }

        // หากยังไม่ได้อนุญาติ
        if((results[0].allow).toLowerCase() === "false"){
            return res.json({
                status: "FAIL",
                error: `You are not allow by admin yet`,
            });
        }

        // หากยังไม่ได้ยืนยันกลับ
        if((results[0].in_location_auth).toLowerCase() === "false"){
            return res.json({
                status: "FAIL",
                error: `You are not authentication for return dorm yet`,
            });
        }

        // ลบข้อมูล
        connection.execute(`DELETE FROM send_form_table WHERE student_id=?`, [student_id], (error, results, fields) =>{
            if(error){
                return res.json({
                    status: "FAIL",
                    error: `mysql error : ${error}`
                });
            }

            return res.json({
                status: "SUCCESS",
                error: null,
                data: {
                    student_id: student_id,
                }
            });
        });
    });
});

module.exports = router;