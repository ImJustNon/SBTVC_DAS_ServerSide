const config = require("../config.js");

module.exports = [
    {
        title: "เพิ่มผู้ใช้นักเรียน (add_student_user)",
        req_res: {
            request: `
POST /api/users/add_student_user
HOST : ${config.server.host}
Content-type : application/json`,
            request_example: `
Json : {
    secret_key : "nonlnwza",
    student_prefix : "นาย",
    student_id : "65202910002",
    student_name : "คณกร",
    student_lastname : "ไทยประโคน",
    student_reg_type : "INFORMATION_TECHNOLOGY"
}`,
            response_example: `
Json : {
    status : "SUCCESS",
    error : null,
    data : {
        results : <MySQL Results>,
    }
}`
        }
    },
    {
        title: "รับการยืนยันที่อยู่จากเครื่อง (auth_receiver)",
        req_res: {
            request: `
POST /api/auth/esp/auth_receiver
HOST: ${config.server.host}
Content-type: application/json`,
            request_example: `
Json : {
    secret_key : "nonlnwza",
    location_auth_id : "vml46sadf464g6se46sger54gse6e",
    type : "<home OR market>",
    for_ : "<out OR in>",
}`,
            response_example: `
Json : {
    status : "SUCCESS",
    error : null,
    data : {
        results : <MySQL Results>,
    }
}`
        }
    },
    {
        title: "ตรวจสอบการ Login (check_login_history)",
        req_res: {
            request: `
GET /api/login/check_login_history
HOST: ${config.server.host}`,
            request_example: `
?client_ip=127.0.0.1
`,
            response_example: `
Json : {
    status : "SUCCESS",
    error : null,
    data : {
        login : true,
        results : <MySQL Results>,
    }
}`
        }
    },
    {
        title: "ตรวจสอบการส่งฟอร์ม (check_send_form_history)",
        req_res: {
            request: `
GET /api/form/check_send_form_history
HOST: ${config.server.host}`,
            request_example: `
?student_id=65202910002
`,
            response_example: `
Json : {
    status : "SUCCESS",
    error : null,
    data : {
        have_data : true,
        results : <MySQL Results>,
    }
}

Json : {
    status : "SUCCESS",
    error : null,
    data : {
        have_data : false,
        results : <MySQL Results>,
    }
}`
        }
    },
    {
        title: "ทดสอบการเชื่อมต่อ ESP8266 เข้ากับ API (chi_test_post)",
        req_res: {
            request: `
POST /api/test/chi_test_post
HOST : ${config.server.host}
Content-type : application/json`,
            request_example: `
Json : {
    text : "Lnwza"
}`,
            response_example: `
Json : {
    status : "SUCCESS",
    error : null,
    data : {
        success : true,
        text : "Lnwza",
    }
}`
        }
    },
    {
        title: "ขอข้อมูลนักเรียน (get_student_user_data)",
        req_res: {
            request: `
GET /api/users/:student_id
HOST : ${config.server.host}`,
            request_example: `
/api/users/65202910002`,
            response_example: `
Json : {
    status : "SUCCESS",
    error : null,
    data : {
        results : <MySQL Results>,
        id : 2,
        student_prefix : "นาย",
        student_id : "65202910002",
        student_name : "คณกร",
        student_lastname : "ไทยประโคน",
        student_reg_type : "INFORMATION_TECHNOLOGY"
    }
}`
        }
    },
    {
        title: "สร้าง QRcode (qr_code_generator)",
        req_res: {
            request: `
GET /api/generator/qr_code_generator
HOST : ${config.server.host}`,
            request_example: `
?location_auth_id=dhfjgsweiguiw45gr9w4ug
&type=<home OR market>
&for_=<out OR in>`,
            response_example: `
Json : {
    status : "SUCCESS",
    error : null,
    data : {
        text : dhfjgsweiguiw45gr9w4ug,
        data : <QRcode in base64>,
    }
}`
        }
    },
    {
        title: "ลบบันทึกการ Login (remove_login_history)",
        req_res: {
            request: `
POST /api/login/remove_login_history
HOST : ${config.server.host}
Content-type : application/json`,
            request_example: `
Json : {
    student_id : "65202910002"
}`,
            response_example: `
Json : {
    status : "SUCCESS",
    error : null,
    data : {
        student_id : "65202910002",
    }
}`
        }
    },
    {
        title: "ลบผู้ใช้นักเรียน (remove_student_user)",
        req_res: {
            request: `
POST /api/users/remove_student_user
HOST : ${config.server.host}
Content-type : application/json`,
            request_example: `
Json : {
    secret_key : "nonlnwza",
    student_id: "65202910002"
}`,
            response_example: `
Json : {
    status : "SUCCESS",
    error : null,
    data : {
        results : results,
    }
}`
        }
    },
    {
        title: "บันทึกการ Login (save_login_history)",
        req_res: {
            request: `
POST /api/login/save_login_history
HOST : ${config.server.host}
Content-type : application/json`,
            request_example: `
Json : {
    student_id : "65202910002",
    client_ip: "127.0.0.1"
}`,
            response_example: `
Json : {
    status : "SUCCESS",
    error : null,
    data : {
        student_id : "65202910002",
        client_ip : "127.0.0.1",
        timestamp : "1688834899589",
    },
}`
        }
    },
    {
        title: "ส่งเเบบฟอร์มขอออก",
        req_res: {
            request: `
POST /api/form/send_form
HOST : ${config.server.host}
Content-type : application/json`,
            request_example: `
Json : {
    student_dorm_number : "65202910002",
    student_room_number : "127.0.0.1"
    student_phone_number : "0936525578"
    student_id : "65202910002"
    leave_date : "07/08/2023"
    leave_time : "11.53.43PM"
    leave_for : "กลับบ้าน"
    come_date : "07/11/2023"
    come_time : "06.00.00PM"
    leave_total : "2"
    travel_by : "ผู้ปกครองมารับ"
    parent_name : "สิทธิกร"
    parent_lastname : "เเป้นสูง"
    parent_phone_number : "0956235789"
    image_link : "https://upload-api.nonlnwza.xyz/image?id=659565464654"
    image_name : "lnwza.png"
}`,
            response_example: `
Json : {
    status: "SUCCESS",
    error: null,
    data: {
        results: <MySQL Results>,
    }
}`
        }
    },
];