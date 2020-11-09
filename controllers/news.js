const db = require('../migrator');
const News = db.news;
const Types = db.news_types;
const Admin = db.admin;
const File = db.news_file;
const Image = db.news_image;
const { validationResult } = require('express-validator');
const mailer = require("../util/nodemailer");
const pdfGenerator = require('../util/pdfGenerator');
const deleteFromLocalFolder = require('../util/deleteFromLocalFolder');



exports.deleteFile = async (req, res, next) => {
  const path = req.query.path;
  await deleteFromLocalFolder(path);
  File.destroy({
    where: {path: path}
  })
  .then(result => {
    res.status(200).json({
        message: 'Successfuly deleted!',
        isDeleted: result
      });
  })
  .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  })
}

exports.deleteImage = async (req, res, next) => {
  const path = req.query.path;
  await deleteFromLocalFolder(path);
  Image.destroy({
    where: {path: path}
  })
  .then(result => {
    res.status(200).json({
        message: 'Successfuly deleted!',
        isDeleted: result
      });
  })
  .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  })
}

exports.sendDataToUserWithPdfFormat = async(req, res) => {
  try{
    const { email, newsIds } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation Failed!.entered data is not correct!')
        error.statusCode = 422;
        throw error;
    }

    const news = await News.findAll({
      where: {
        id: newsIds
      }, 
      include: [File, Image]
    });
    const fullSelectedNews = await news.map(item => item.dataValues);
    const pdfPath = pdfGenerator(fullSelectedNews);

    const message = {
      to: email,
      subject: 'Selected News in format Pdf',
      html: `
        <a href=${process.env.NODE_BASE_URL}${pdfPath}>Go throw this link and see pdf File</a>
      `
    }
    mailer(message);
    await res.status(200).json({message: 'Selected News is generated in pdf file Successfully :)'})
  }catch(err) {
    res.status(500).send({
      message: "Error on Generating selected news to pdf format",
      error: err.message,
    });
  }
};

exports.getAttachedAdmins = (req, res) => {
  const newsId = req.query.newsId;
  News.findAll({
    where:  {id: newsId},
    include: {
      model: Admin
    }
  }).then(result => {
    res.status(200).json({result})
  })
  .catch(error => {
    console.log(error);
  })
};

exports.attachAdminToNews = (req, res) => {
  const { newsId, email } = req.body;
  Admin
    .findOne({
      where: {email: email}
    })
    .then(item=>{
      item.addNews(newsId, {through: {role: 'User'}});
      res.status(200).json({message: `Successfully attached admin with email:${email} to news with id:${newsId}`});
    })
    .catch(error => {
      res.status(500).send({
        message: "Error on attach news to Admin",
        error: error.message,
      });
    })
};

exports.getMyNewsList = (req, res) => {
  const id = req.adminId;
  Admin.findOne({
    where: {id: id}, 
    include: {
      model: News
    }
  }).then(result => {
    res.status(200).json({result});
  })
  .catch(error => {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  });
};

exports.getNewsList = async(req, res) => {
  try {
    let page =req.query.page || 1;
    let limit = req.query.limit || 2;
    let typeId=req.query.typeId;

    const offset = (page-1) * limit;
    let conditions = {};
    
    if(typeId !== undefined) {
      conditions.type_id = typeId
    }
    let options = {
      where: conditions,
      attributes: ['id', 'title', 'content', 'type_id'],
      order: [
        ['createdAt', 'DESC']
      ],
      limit: limit,
      offset: offset
    };
    News
    .findAndCountAll({...options})
    .then(data => {
      const totalPages = Math.ceil(data.count / limit);
      const response = {
        message: "Pagination Filtering Sorting request is completed! Query parameters: page = " + page + ", limit = " + limit + ", typeId = " + typeId,
          totalItems: data.count,
          totalPages: totalPages,
          limit: limit,
          currentPageNumber: parseInt(page),
          currentPageSize: data.rows.length,
          news: data.rows
      }
      res.status(200).json({response: response})
    })
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }
};

exports.addNews = async (req,res,next) => {
  try {
    const admin_id = req.adminId;
    const { title, content, typeId  } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ 
          errors: errors.array()
        });
    }
    // if(!req.files) {
    //   const err = new Error();
    //   err.statusCode = 422;
    //   err.message = ('No Files provided');
    //   throw err;
    // }
    let admin = await Admin.findOne({
      where: {
        id: admin_id
      }
    });

    let news = await News.create({
      title: title,
      content: content,
      type_id: typeId,
    });
    if(req.files) {
      for(let i = 0; i < req.files.length; i++) {
        let isImage = req.files[i].mimetype.startsWith('image');
        let file;
        if(isImage) {
          file = await Image.create({...req.files[i], news_id: news.id}, { foreignKey: 'news_id'});
          //news.addImages(file);
        }else {
          file = await File.create({...req.files[i], news_id: news.id}, { foreignKey: 'news_id'});
          // news.addImages(file);
        }
      };
    };

    let result = await admin.addNews(news, { through: { role: 'Author'}});
    res.status(200).json({
          message: 'successfuly added !',
          news: result,
    })
  }catch (err)  {
    console.log('err', err)
        if(!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateNews = async (req,res,next) => {
  try {
    const admin_id = req.adminId;
    const newsId = req.params.newsId;
    const { title, content, newsType } = req.body;
    const errors = validationResult(req);
      if(!errors.isEmpty()) {
        const error = new Error('Validation Failed!.entered data is not correct!')
        error.statusCode = 422;
        throw error;
        
      }

    const news = await News.findOne ({
      where: {
        id: newsId
      }
    })
    if(!news) {
      const error = new Error('Could not find admin !');
      error.statusCode = 404;
      throw error;
    }
    news.title = title,
    news.content = content,
    news.newsType = newsType,
    news.admin_id = admin_id
    if(req.files) {
      for(let i = 0; i < req.files.length; i++) {
        let isImage = req.files[i].mimetype.startsWith('image');
        let file;
        if(isImage) {
          file = await Image.create({...req.files[i], news_id: news.id}, { foreignKey: 'news_id'});
          // news.addImage(file); 
        }else {
          file = await File.create({...req.files[i], news_id: news.id}, { foreignKey: 'news_id'});
          // news.addFile(file);
        }
      };
    }
    await news.save();
  
    res.status(200).json({
      message: 'News updated successfuly !',
        news: news
    })
  }catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteNews = (req,res,next) => {
  const newsId = req.params.newsId;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error('Validation Failed!.entered data is not correct!')
    error.statusCode = 422;
    throw error;
  }
  News
    .destroy({
      where: {
        id: newsId
      }
    })
    .then(result => {
      res.status(200).json({
          message: 'Successfuly deleted!',
          isDeleted: result
        });
    })
    .catch(err => {
        if(!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
    })
};

exports.getCurrentNews = (req,res, next) => {
  const newsId = req.params.newsId;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error('Validation Failed!.entered data is not correct!')
    error.statusCode = 422;
    throw error;
  };
  News.findOne({
    where: {
      id: newsId
    },
    include: [File, Image, Admin]
  })
  .then(news => {
    if(!news) {
      const error = new Error('Could not find current news !');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({news: news})
  })
  .catch(err => {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
};

exports.getTypes = (req, res, next) => {
  Types
  .findAll()
  .then(types => {
      res.status(200).json({
        message: 'Fetched Types successfuly.',
        types: types
      })
  })
  .catch(err => {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
};