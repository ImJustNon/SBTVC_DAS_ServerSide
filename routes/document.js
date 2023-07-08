const express = require("express");
const path = require("path");
const router = express.Router();
const document_data = require("../configs/document/api_document.js");

router.get("/pages/document", async(req, res) =>{
    return res.render(path.join(__dirname + "/../views/index.ejs"), {
        document_data: document_data,
    });
});

module.exports = router;