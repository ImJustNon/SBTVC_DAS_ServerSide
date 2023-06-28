const express = require("express");
const router = express.Router();
const { connection } = require("../database/connect.js");


router.get("/api/form/check_send_form_history", async(req, res) =>{
    const { student_id } = req.query ?? {};
    
    if(!student_id){ 
        return res.json({
            status: "FAIL",
            error: "please provide 'student_id' query",
        });
    }

    connection.execute('SELECT * FROM send_form_table WHERE student_id = ?', [student_id], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                error: `Cant connect to database : ERROR : ${err}`,
            });
        }

        if(results.length === 0){
            return res.json({
                status: "SUCCESS",
                error: null,
                data: {
                    have_data: false,
                    results: [],
                }
            });
        }
        
        return res.json({
            status: "SUCCESS",
            error: null,
            data: {
                have_data: true,
                results: results,
            }
        });
    });
});

module.exports = router;