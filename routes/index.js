const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", async(req, res) =>{
    return res.redirect("/pages/document");
});

module.exports = router;