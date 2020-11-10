var multer  = require('multer');
const uuid = require('uuid');
const path = require('path');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});

const uploader = multer({ storage: fileStorage });

module.exports = uploader