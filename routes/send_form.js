const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    extended: true,
    limit: "50mb", 
});
const { connection } = require("../database/connect.js");

const { random_string } = require("../utils/random_string.js");

router.post("/api/form/send_form", urlEncoded, async(req, res) =>{
    const {     
        // ข้อมูลนักเรียน
        student_prefix,           //-
        student_name,             //-
        student_lastname,         //-
        student_dorm_number,      
        student_room_number,      
        student_phone_number, 
        student_id,   //-
        // ข้อมูลสาขา
        student_reg_type,         //-
        // ข้อมูลออกหอพัก
        leave_date,
        leave_time,
        leave_for,
        come_date,
        come_time,
        leave_total,
        travel_by,
        // ข้อมูลผู้ปกครอง
        parent_name,
        parent_lastname,
        parent_phone_number,
        // file
        image_link,
        image_name,
    } = req.body ?? {};

    const timestamp = new Date().getTime();
    const in_location_auth = "false";
    const allow = "false";
    const out_location_auth = "false";
    const location_auth_id = random_string(50); //สุ่มตัวอักษร 50 ตัว



    // อัปโหลดเข้า database zone 
    connection.execute(`INSERT INTO send_form_table(
student_prefix,
student_name,
student_lastname,
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
location_auth_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
        student_prefix,
        student_name,
        student_lastname,
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
        location_auth_id,
    ], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                error: `Cant INSERT INTO Table : ERROR : ${err}`,
            });
        }

        res.json({
            status: "SUCCESS",
            error: null,
            data: {
                results: results,
            }
        });
    });
});

module.exports = router;