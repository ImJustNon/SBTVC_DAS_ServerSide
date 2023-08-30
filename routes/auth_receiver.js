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

router.post('/api/auth/esp/auth_receiver', urlEncoded, async(req, res) =>{
    const { secret_key, location_auth_id, type, for_ } = req.body ?? {};

    if(!location_auth_id || !type || !for_ || !secret_key){
        return res.json({
            status: "FAIL",
            error: "Please provide 'location_auth_id', 'type', 'for_' query",
        });
    }

    // check key
    if(secret_key !== config.api.secret_key){
        return res.json({
            status: "FAIL",
            error: "key auth fail",
        });
    }

    if(type === "home"){
        if(for_ === "out"){
            connection.execute('UPDATE send_form_table SET out_location_auth = ? WHERE location_auth_id = ?', ["true", location_auth_id], async(err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        error: `Cant update 'out_location_auth' table : ERROR : ${err}`,
                    });
                }

                // send line notification
                await SendNotification(location_auth_id).then((status) =>{
                    if(status === 0){
                        return res.json({
                            status: "SUCCESS",
                            error: 'Line notification dont send',
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
                // send line notificaton
                // connection.execute("SELECT student_id FROM send_form_table WHERE location_auth_id=?", [location_auth_id], async(error, results, fields) =>{
                //     if(error){
                //         return res.json({
                //             status: "FAIL",
                //             error: `Mysql error :: ${error}`,
                //         });
                //     }
                //     if(results.length === 0){
                //         return res.json({
                //             status: "FAIL",
                //             error: `Cant find data from this ID : ${location_auth_id}`,
                //         });
                //     }

                //     const response = await axios.post(`${config.server.domain}/api/notification/line/send_notification`, {
                //         student_id: results[0].student_id
                //     }, {
                //         headers: {
                //             'Content-Type': 'application/json'
                //         }
                //     });

                //     if(response.data.status === "FAIL"){
                //         return res.json({
                //             status: "FAIL",
                //             error: response.data.error,
                //         });
                //     }

                //     return res.json({
                //         status: "SUCCESS",
                //         error: null,
                //     });
                // });
            });
        }
        if(for_ === "in"){
            connection.execute('UPDATE send_form_table SET in_location_auth = ? WHERE location_auth_id = ?', ["true", location_auth_id], (err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        error: `Cant update 'out_location_auth' table : ERROR : ${err}`,
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
        }
    }
    else if(type === "market"){
        
    }
});



async function SendNotification(auth_id){
    return new Promise((resolve, reject) => {
        connection.execute("SELECT student_id FROM send_form_table WHERE location_auth_id=?", [auth_id], async(error, results, fields) =>{
            if(error) return resolve(0);
            if(results.length === 0) return resolve(0);

            const response = await axios.post(`https://sbtvc-das-api.nonlnwza.xyz/api/notification/line/send_notification`, {
                student_id: results[0].student_id
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(response === "FAIL"){
                return resolve(0);
            }
            return resolve(1);
        });
    });
} 

module.exports = router;