const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});

const config = require("../configs/config.js");

router.post('/api/users/remove_student_user', urlEncoded, async(req, res) =>{
    const { secret_key, student_id} = req.body ?? {};

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

    if(!student_id){
        return res.json({
            status: "FAIL",
            error: "please provide 'student_id'"
        });
    }

    // เช็คว่าพบ user นี้ซ้ำหรือไม่
    connection.execute("SELECT * FROM student_data_table WHERE student_id=?", [student_id], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                error: `mysql error : ERROR : ${err}`
            });
        }
        if(results.length === 0){
            return res.json({
                status: "FAIL",
                error: `Cant find user 'student_id' : ${student_id} from database`
            });
        }

        // ลบ user ออกจาก database
        connection.execute("DELETE FROM student_data_table WHERE student_id=?", [student_id], async(err, results, fields) =>{
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