const express = require('express');
const multer = require('multer');
const multerGoogleStorage = require('multer-google-storage');
const upload = multer({
    storage: multerGoogleStorage.storageEngine({
        bucket:'uselessthon7',
        projectId:'fluent-century-187304',
        keyFilename:'config/gcp_storage_keyfile.json'
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});
const router = express.Router();
const mysql      = require('mysql');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);
connection.connect();

router.get('/', function(req, res, next) {
    res.render('fileupload');
});

router.post('/', upload.single('userfile'), function (req, res, next) {
    //console.log(req.body.category[0]);
    // res.send(req.file);

    const SQL = `INSERT INTO description(title, description, url) VALUES(${req.body.title}, ${req.body.desc}, ${req.file.path}) returning seq`;
    connection.query(SQL, function(err, rows) {
        if(err) throw err;

        console.log(rows);

        res.status(200);
    });
});

module.exports = router;
