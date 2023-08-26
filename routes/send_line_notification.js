const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const config = require("../configs/config.js");
const axios = require("axios");

router.post('/api/notification/line/send_notification', urlEncoded, async(req, res) =>{
    const { student_id } = req.body ?? {};

    if(!student_id){
        return res.json({
            status: "FAIL",
            error: `Cant find student_id`,
        });
    }

    const token = config.apis.line_notification_token;

    connection.execute('SELECT * FROM send_form_table WHERE student_id=?', [student_id], async(error, results, fields) =>{
        if(error){
            return res.json({
                status: "FAIL",
                error: `Mysql error :: ${error}`,
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                error: `Cant find data from this student_id: ${student_id}`
            });
        }

        const message = `\n\n******************** ข้อมูลเเบบฟอร์มทั้งหมด ******************** \n\n` 
                        + `ID  :: ${results[0].id} \n` 
                        + `เลขนักเรียน  :: ${results[0].student_id} \n` 
                        + `ชื่อ  ::  ${results[0].student_prefix} ${results[0].student_name} ${results[0].student_lastname} \n` 
                        + `ปี  :: ${results[0].student_year_level} \n` 
                        + `หอ  :: ${results[0].student_dorm_number} \n` 
                        + `ห้อง  :: ${results[0].student_room_number} \n` 
                        + `เบอร์นักเรียน  :: ${results[0].student_phone_number} \n` 
                        + `สาขา  :: ${results[0].student_reg_type} \n` 
                        + `วันออก  :: ${results[0].leave_date} \n` 
                        + `เวลาออก  :: ${results[0].leave_time} \n` 
                        + `วันเข้า  :: ${results[0].come_date} \n` 
                        + `เวลาเข้า  :: ${results[0].come_time} \n` 
                        + `รวมวัน  :: ${results[0].leave_total} \n` 
                        + `เดินทางโดย  :: ${results[0].travel_by} \n` 
                        + `ชื่อผู้ปกครอง  :: ${results[0].parent_name} ${results[0].parent_lastname} \n` 
                        + `เบอร์ผู้ปกครอง  :: ${results[0].parent_phone_number} \n` 
                        + `Timestamp  :: ${(new Date((parseInt(results[0].timestamp) + (7 * 60 * 60 * 1000)))).toUTCString()} \n` 
                        + `\n************************* การยืนยัน ************************* \n\n` 
                        + `สถานที่ยืนยัน (ออก)  :: ${results[0].out_location_auth === "true" ? "✅ ยืนยันเเล้ว" : "❌ ยังไม่ได้ยืนยัน"} \n` 
                        + `อนุมัติ  :: ${results[0].allow === "true" ? "✅ อนุมัติเเล้ว" : "❌ ยังไม่อนุมัติ"} \n` 
                        + `สถานที่ยืนยัน (เข้า)  :: ${results[0].in_location_auth === "true" ? "✅ ยืนยันเเล้ว" : "❌ ยังไม่ได้ยืนยัน"} \n` 
                        + `กลับเเล้ว  :: ${results[0].backin === "true" ? "✅ ใช่" : "❌ ไม่"} \n`
                        + `\n*************************** ลิ้งค์ *************************** \n\n`
                        + `ลิ้งอนุญาติรวดเร็ว :: https://sbtvc-das-admin.nonlnwza.xyz/p/quick-allow?student_id=${results[0].student_id} \n`
                        + `Admin :: https://sbtvc-das-admin.nonlnwza.xyz \n`
                        + `Main :: https://sbtvc-das-2.nonlnwza.xyz \n`
                        + `\n **********************************************************`;



        try {
            const response = await axios.post('https://notify-api.line.me/api/notify',`message=${message}`,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.data.message !== "ok"){
                return res.json({
                    status: "FAIL",
                    error: response.data
                });
            }
            return res.json({
                status: "SUCCESS",
                error: null,
                data: {
                    message: message,
                },
            });
        } catch (err) {
            return res.json({
                status: "FAIL",
                error: err,
            });
        }
    });     
});

module.exports = router;