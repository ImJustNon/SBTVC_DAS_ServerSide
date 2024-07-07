const express = require("express");
const router = express.Router();
const QRCode = require('qrcode');
const config = require("../configs/config.js");
const bwipjs = require('bwip-js');

router.get("/api/generator/qr_code_generator", (req, res) =>{
    /**
     *  text => token ที่เจนมา
     *  type => คือ การออกเพื่ออะไร (กลับบ้าน หรือ ตลาด)
     *  for => คือยืนยันว่า ไปหรือกลับ
     */

    const { location_auth_id, type, for_ } = req.query ?? {};

    if(!location_auth_id || !type || !for_ ){
        return res.json({
            status: "FAIL",
            error: "Please provide 'text', 'type', 'for_' query for make qr_code"
        });
    }

    const forNumber = for_ === "in" ? "1" : "0";

    // if(for_ !== "out" || for_ !== "in") 

    bwipjs.toBuffer({
        bcid: 'code128', 
        text: `${forNumber}${location_auth_id}`, 
        scale: 3,           
        height: 15,            
        includetext: true,          
        textxalign: 'center',       
    }, function (err, png) {
        if (err) {
            return res.json({
                status: `FAIL`,
                error: `Cant covert text to qr : ERROR : ${err}`,
            });
        } else {
            const base64 = png.toString('base64');
            const base64Image = `data:image/png;base64,${base64}`;
            return res.json({
                status: "SUCCESS",
                error: null,
                data: {
                    text: location_auth_id,
                    data: base64Image,
                }
            });
        }
    });
    

    // QRCode.toDataURL(JSON.stringify({
    //     type: type,
    //     for_: for_,
    //     auth_token: location_auth_id,
    //     create_on: new Date().getTime(),
    // }), async(err, url) =>{
    //     if(err){
    //         return res.json({
    //             status: `FAIL`,
    //             error: `Cant covert text to qr : ERROR : ${err}`,
    //         });
    //     }

        

    //     return res.json({
    //         status: "SUCCESS",
    //         error: null,
    //         data: {
    //             text: location_auth_id,
    //             data: url,
    //         }
    //     });
    // });


});

module.exports = router;