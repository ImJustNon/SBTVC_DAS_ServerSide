const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});

const config = require("../configs/config.js");

router.post('/api/users/add_student_user', urlEncoded, async(req, res) =>{
    const { secret_key, student_prefix, student_id, student_name, student_lastname, student_reg_type } = req.body ?? {};

    if(!secret_key){
        return res.json({
            status: "FAIL",
            error: "please provide 'secret_key'"
        });
    }

    if(secret_key !== config.api.secret_key){
        return res.json({
            status: "FAIL",
            error: "'secret_key' fail"
        });
    }

    if(!student_id || !student_prefix || !student_name || !student_lastname || !student_reg_type){
        return res.json({
            status: "FAIL",
            error: "please provide 'student_id', 'student_prefix', 'student_name', 'student_lastname', 'student_reg_type'"
        });
    }

    // เช็ค user ซ้ำหรือไม่
    connection.execute("SELECT * FROM student_data_table WHERE student_id=?", [student_id], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                error: `mysql error : ERROR : ${err}`
            });
        }
        if(results.length > 0){
            return res.json({
                status: "FAIL",
                error: "This user has already recorded on database"
            });
        }

        // บันทึก user ลง database
        connection.execute("INSERT INTO student_data_table(student_prefix,student_id,student_name,student_lastname,student_reg_type) VALUES(?,?,?,?,?)", [student_prefix, student_id, student_name, student_lastname, student_reg_type], async(err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    error: `mysql fail : ERROR : ${err}`
                });
            }

            return res.json({
                status: "SUCCESS",
                error: null,
                data: {
                    results: results,
                }
            });
        });
    }); 
});

module.exports = router;