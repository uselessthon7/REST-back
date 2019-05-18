const express = require('express');
const multer = require('multer');
const multerGoogleStorage = require('multer-google-storage');
const upload = multer({
    storage: multerGoogleStorage.storageEngine({
        bucket: 'uselessthon7',
        projectId: 'fluent-century-187304',
        keyFilename: 'config/gcp_storage_keyfile.json'
    }),
    limits: {fileSize: 5 * 1024 * 1024}
});

const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../config/database.js');
const connection = mysql.createConnection(dbconfig);
connection.connect();

router.get('/test', function (req, res, next) {
    res.render('fileupload');
});

router.post('/', upload.single('userfile'), function (req, res, next) {
    const SQL = `INSERT INTO description(title, description, url) VALUES('\''${req.body.title}'\'', '\''${req.body.desc}'\'', '\''${req.file.path}'\'')`;
    connection.query(SQL, function (err, rows) {
        if (err) throw err;

        let list = req.body.category;
        let values = [];
        for(let i = 0; i < list.length; i++) {
            values.push([list[i], rows.insertId]);
        }
        connection.query(`INSERT INTO category_has_description VALUES ?`, [values], function (err, rows) {
            if (err) throw err;
            res.status(200);
        });
    });
});


router.get('/', function (req, res, next) {
    let list = req.query.q;
    const SQL = 'SELECT * FROM description WHERE seq IN (SELECT d_seq FROM category_has_description WHERE c_seq IN (?)) ORDER BY rand() LIMIT 10';
    connection.query(SQL, [list], function (err, rows) {
        if (err) throw err;
        res.json(rows);
    });
});

module.exports = router;
