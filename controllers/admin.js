const db = require('../migrator');
const Admin = db.admin;
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const mailer = require("../util/nodemailer");
const News = db.news;




exports.sendInvitation = (req, res, next) => {
  const { email, role } = req.body;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error()
    error.statusCode = 422;
    error.message = 'Validation Failed!.entered data is not correct!';
    throw error;
  }
  const invitToken = jwt.sign({
    email: email,
    role: role,
    isConfirmed: true,
    isActive: true
  },
    'RANDOM_TOKEN_FOR_INVITATION',
    {expiresIn: '24h'}
  );

  const invitationMessage = {
    to: email,
    subject: 'Invitation Message',
    html: `
      <a href="${process.env.REACT_BASE_URL}accept-invitation/${invitToken}">got throw this link and activate</a>
    `
  }
  mailer(invitationMessage);
  return res.status(200).json({message: 'Your invititation is sent successfuly :)'})
 }

 exports.getRecievedToken = (req, res, next) => {
    const token = req.query.hashedToken;
    if(!token){
      const error = new Error();
      error.statusCode = 401;
      error.message = 'Not token...';
      throw error;
    }
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'RANDOM_TOKEN_FOR_INVITATION')
    } catch(err) {
        err.statusCode = 500;
        err.message = 'error from decodedToken'
        throw err;
    }

    if(!decodedToken) {
        const error = new Error();
        error.statusCode = 401;
        error.message = "there is no decoded value"
        throw error;
    }

    return res
      .status(200)
      .json({
          email: decodedToken.email, 
          role: decodedToken.role,
          isConfirmed: decodedToken.isConfirmed,
          isActive: decodedToken.isActive
      })
 }

exports.registerNewAdmin = (req,res,next) => {
    const {
      firstname, 
      lastname, 
      email, 
      password, 
      role, 
      isConfirmed, 
      isActive, 
      isInvitation
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400).
        json({ 
          errors: errors.array()
        });
    }
  
    bcrypt
    .hash(password, 12)
    .then(hashedpassword => {
        Admin.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedpassword,
            role: role,
            isActive: isActive || false,
            isConfirmed: isConfirmed || false
        }).then(result => {
            if(isInvitation === undefined) {
              let superAdmins = [];
              Admin.findAll({
                where: {
                  role: 'super'
                }
              }).then(admins => {
                admins.map(item => {
                  superAdmins.push(item.dataValues.email)
                });
              })
              const message = {
                to: superAdmins,
                subject: 'Congradulation, you are successfuly registered',
                html: `
                  <a href="${process.env.REACT_BASE_URL}accept-panel-admins-page">got throw this link and activate</a>
                `
              }
              mailer(message);
            }
            res.status(201).json({
              message: 'Successfuly created new Admin!',
              data: result.id
            });
        }).catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
                err.message = "something wrong with registration :|"
            }
            next(err);
        })
    }) 
};

exports.loginAdmin = (req, res, next) => {
  const email = req.body.email;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ 
        errors: errors.array()
      });
  }
  let loadeAdmin;
  console.log('Admin', Admin)
    Admin
    .findOne({ 
      where: {
        email: email
      }
    })
    .then(user => {
        if (!user) {
          return res
            .status(400)
            .json({ 
              errors: [{param: 'email', msg: 'There is no user with this email'}] 
            });
        }
        loadeAdmin = user;
        if(
            loadeAdmin.dataValues.isConfirmed === false && 
            loadeAdmin.dataValues.isActive === false
          ) {
            return res
              .status(400)
              .json({ 
                errors: [{param: 'email', msg: 'your status is not activated yet:('}] 
            });
        }
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(isEqual => {
        if(!isEqual) {
          return res
            .status(400)
            .json({ 
              errors: [{param: 'password', msg: 'wrong password'}] 
            });
        }
        const token = jwt.sign({
          email: loadeAdmin.email,
          adminId: loadeAdmin.id.toString()
        },
          process.env.RANDOM_TOKEN_SECRET,
          {expiresIn: '3h'}
        );
        res.status(200).json({token: token, admin_id: loadeAdmin.id});
      }).catch(
        (error) => {
          res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
          });
        }
    );
  };

exports.getAdmins = (req,res, next) => {
  const role = req.query.role;
  let conditions = {};
    
  if(role !== undefined) {
    conditions.role = role
  }
  let options = {
    where: conditions,
  };
    Admin
        .findAll(options)
        .then(admins => {
            res.status(200).json({
              message: 'Fetched Admins successfuly.',
              admins: admins
            })
        })
        .catch(err => {
          if(!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        })
};

exports.getAdmin = (req, res, next) => {
  
  const adminId = req.params.adminId;
  Admin.findOne({
    where: {
      id: adminId
    },
    include: {
      model: News
    }
  })
    .then(admin => {
      if(!admin) {
        const error = new Error();
        error.statusCode = 404;
        error.message = 'Could not find admin.';
        throw error;
      }
      res.status(200).json({
        message: 'Admin fetched.',
        admin: admin
      })
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })

};

exports.updateAdmin = (req,res,next) => {
  const { firstname, lastname, email } = req.body;
  const id = req.params.adminid
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ 
        errors: errors.array()
      });
  }
  Admin.findOne({
    where: {
      id: id
    }
  })
  .then(admin => {
    if(!admin) {
      return res
        .status(400)
        .json({ 
          errors: [{param: 'email', msg: 'Could not find admin with this email'}]
        });
    }
    admin.firstname = firstname,
    admin.lastname = lastname;
    admin.email = email;
    admin.role = admin.role;
    return admin.save();
  })
  .then(updatedAdmin => {
    res.status(200).json({
      message: 'Admin updated successfuly !',
      admin: updatedAdmin
    })
  })
  .catch(err => {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
};

exports.deleteAdmin = (req, res, next) => {
  const adminId = req.params.adminId;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const err = new Error()
    err.statusCode = 422;
    err.message = 'Validation Failed!.entered data is not correct!';
    throw err;
  }
  Admin
    .destroy({
      where: {
        id: adminId
      }
    })
    .then(result => {
      res.status(200).json({message: 'Successfuly deleted!'})
    })
    .catch(err => {
        if(!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
    })
}

exports.togglePanelAdminStatus = (req, res, next) => {
  const id = req.params.id;
  const isActive = req.body.isActive;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const err = new Error()
    err.statusCode = 422;
    err.message = 'Validation Failed!.entered data is not correct!';
    throw err;
  }
  Admin.findOne({
    where: {
      id: id
    }
  })
  .then(admin => {
    if(!admin) {
      const error = new Error('Could not find admin !');
      error.statusCode = 404;
      throw error;
    }
    admin.isActive = isActive;
    return admin.save();
  })
  .then(result => {
    res.status(200).json({
      message: `The admins status is successfuly changed !`,
      admin: result
    })
  })
  .catch(err => {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
}

exports.toggleConfirmAdmin = (req, res, next) => {
  const id = req.params.id;
  const isConfirmed = req.body.isConfirmed;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const err = new Error()
    err.statusCode = 422;
    err.message = 'Validation Failed!.entered data is not correct!';
    throw err;
  }

  Admin.findOne({
    where: {
      id: id
    }
  })
  .then(admin => {
    if(!admin) {
      const error = new Error('Could not find admin !');
      error.statusCode = 404;
      throw error;
    }

    if(isConfirmed === false) {
      admin.isConfirmed = isConfirmed;
      admin.isActive = false
    }
    admin.isConfirmed = isConfirmed;
    return admin.save();
  })
  .then(result => {
    res.status(200).json({
      message: `The admin is successfuly confirmed :) !`,
      admin: result
    })
  })
  .catch(err => {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
};


