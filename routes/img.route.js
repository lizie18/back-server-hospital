var express = require("express");
const path = require('path');
const fs = require('fs')

var app = express();

app.get("/:type/:img", (req, res, next) => {
    const type = req.params.type;
    const img = req.params.img;

    const pathImage = path.resolve(__dirname, `../uploads/${type}/${img}`)
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const pathNoImg = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImg);
    }
});

module.exports = app;
