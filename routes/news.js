const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');
const isAuth = require('../middleware/is-auth');
var multer  = require('multer')
const path = require('path');
const uuid = require('uuid');
const newsValidator = require('../validations/newsValidator');


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: fileStorage });

router.post(
        '/news',
        upload.array('file', 10),
        isAuth,
        newsValidator,
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


