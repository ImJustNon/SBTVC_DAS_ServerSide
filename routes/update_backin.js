const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    extended: true,
    limit: "50mb", 
});
const { connection } = require("../database/connect.js");

router.post("/api/form/update_backin", urlEncoded, async(req, res) =>{
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

        // อัปเดต โย้กข้อมูล
        await InsertDataToNewTable({
            old_id: results[0].id,
            student_prefix: results[0].student_prefix,
            student_name: results[0].student_name,
            student_lastname: results[0].student_lastname,
            student_year_level: results[0].student_year_level,
            student_dorm_number: results[0].student_dorm_number,
            student_room_number: results[0].student_room_number,
            student_phone_number: results[0].student_phone_number,
            student_id: results[0].student_id,
            student_reg_type: results[0].student_reg_type,
            leave_date: results[0].leave_date,
            leave_time: results[0].leave_time,
            leave_for: results[0].leave_for,
            come_date: results[0].come_date,
            come_time: results[0].come_time,
            leave_total: results[0].leave_total,
            travel_by: results[0].travel_by,
            parent_name: results[0].parent_name,
            parent_lastname: results[0].parent_lastname,
            parent_phone_number: results[0].parent_phone_number,
            image_link: results[0].image_link,
            image_name: results[0].image_name,
            timestamp: results[0].timestamp,
            in_location_auth: results[0].in_location_auth,
            allow: results[0].allow,
            out_location_auth: results[0].out_location_auth,
            backin: results[0].backin,
            location_auth_id: results[0].location_auth_id,
        });
    });
});


async function InsertDataToNewTable({   
    old_id,
    student_prefix,
    student_name,
    student_lastname,
    student_year_level,
    student_dorm_number,
    student_room_number,
    student_phone_number,
    student_id,
    student_reg_type,
    leave_date,
    leave_time,
    leave_for,
    come_date,
    come_time,
    leave_total,
    travel_by,
    parent_name,
    parent_lastname,
    parent_phone_number,
    image_link,
    image_name,
    timestamp,
    in_location_auth,
    allow,
    out_location_auth,
    backin,
    location_auth_id,
}){
    connection.execute(`INSERT INTO home_form_history_table(
old_id,
student_prefix,
student_name,
student_lastname,
student_year_level,
student_dorm_number,
student_room_number,
student_phone_number,
student_id,
student_reg_type,
leave_date,
leave_time,
leave_for,
come_date,
come_time,
leave_total,
travel_by,
parent_name,
parent_lastname,
parent_phone_number,
image_link,
image_name,
timestamp,
in_location_auth,
allow,
out_location_auth,
backin,
location_auth_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [parseInt(old_id), student_prefix, student_name, student_lastname, student_year_level, student_dorm_number, student_room_number, student_phone_number, student_id, student_reg_type, leave_date, leave_time, leave_for, come_date, come_time, leave_total, travel_by, parent_name, parent_lastname, parent_phone_number, image_link, image_name, timestamp, in_location_auth, allow, out_location_auth, backin, location_auth_id], async(error, results, fields) =>{
    if(error){
        return res.json({
            status: "FAIL",
            error: `Mysql error :: ${error}`,
        });
    }

    return res.json({
        status: "SUCCESS",
        error: null,
        data: {
            results: results,
        },
    });
});
}

module.exports = router;