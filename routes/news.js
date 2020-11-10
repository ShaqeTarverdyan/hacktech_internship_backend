const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');
const isAuth = require('../middleware/is-auth');
const newsValidator = require('../validations/newsValidator');
const uploader = require('../util/fileUploader');


router.post(
            '/news',
            uploader.array('file', 10),
            isAuth,
            newsValidator(),
            newsController.addNews
        );
router.put(
            '/news/:newsId', 
            uploader.array('file', 10), 
            isAuth, 
            newsValidator(),
            newsController.updateNews
        );
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


