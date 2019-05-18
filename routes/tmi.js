const express = require('express');
const multer = require('multer');
const multerGoogleStorage = require('multer-google-storage');
const upload = multer({
    storage: multerGoogleStorage.storageEngine({
        bucket:'uselessthon7',
        projectId:'fluent-century-187304',
        keyFilename:'config/gcp_storage_keyfile.json',
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('fileupload');
});

router.post('/', upload.single('userfile'), function (req, res, next) {
    console.log(req.file);
    console.log(req.body.title);
    //console.log(req.body.category[0]);

    // TODO img 리사이징

    res.json({ url: req.file.path });
});

module.exports = router;
