const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const newsController = require('../controllers/news');
const isAuth = require('../middleware/is-auth');
var multer  = require('multer')
const path = require('path');
const uuid = require('uuid')


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});


// const fileFilter = (req, file, cb) => {
//     console.log('file', file);
//     if(
//         file.mimetype === 'image/png' || 
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/jpeg'
//     ) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     };
//    // checkFileType(file, cb)
// };

const upload = multer({ storage: fileStorage });

router.post(
        '/news',
        upload.array('file', 10),
        isAuth,
        [
            body('title')
                .trim()
                .notEmpty(),
            body('content')
                .trim()
                .notEmpty()
        ],
        newsController.addNews);
router.put('/news/:newsId', upload.array('file', 10), isAuth, newsController.updateNews);
router.delete('/news/:newsId',isAuth, newsController.deleteNews);
router.get('/news-/:newsId', isAuth, newsController.getCurrentNews);
router.get("/types",isAuth, newsController.getTypes);

router.get('/news?', isAuth, newsController.getNewsList);
router.get('/myNews?', isAuth, newsController.getMyNewsList);
router.post('/attachAdminToNews', newsController.attachAdminToNews);
router.get('/attachedAdmins', isAuth, newsController.getAttachedAdmins);
router.post('/sendDataToUserWithPdfFormat', newsController.sendDataToUserWithPdfFormat);
router.get('/deleteImage',isAuth, newsController.deleteImage);
router.get('/deleteFile',isAuth, newsController.deleteFile)

module.exports = router;


