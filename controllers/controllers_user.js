const User = require("../models/models_user");
const Ajudaris = require("../models/models_ajudaris");
const Submission = require("../models/models_submission");
const OTP = require("../models/models_otp");
const utilities = require("../utilities/utilities");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const secret = process.env.SECRET


const login = (req, res) => {
  User.find({ email: req.body.email })
    .then((user) => {
      if (user.length > 0) {
        bcrypt
          .compare(req.body.password, user[0].password)
          .then(function (result) {
            if (result) {
              let homeUrl
              if (user[0].role == "institution") {
                homeUrl = "/home.html"
              } else if (user[0].role == "admin") {
                homeUrl = "/adminHome.html"
              }
              else if (user[0].role == "illustrator") {
                homeUrl = "/illustratorHome.html"
              } else {
                homeUrl = "/specialHome.html"
              }
              utilities.generateToken({ user: req.body.email, role: user[0].role, verified: user[0].verified }, (token) => {       
                    res.status(200).send({ homeUrl: homeUrl, user: user[0], accessToken: token.accessToken, refreshToken: token.refreshToken })
              });
              } else {
                res.status(401).send("Not Authorized");
              }
          });
      } else {
        res.status(401).send("Not Authorized");
      }
    })
    .catch((error) => {
      res.status(400).send('Error: ' + error);
    });
};



const refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).send("Refresh token required");
  }

  jwt.verify(refreshToken, secret, (err, decoded) => {
    if (err){ return res.status(403).send("Invalid refresh token")};

    if(req.body.email != decoded.data.user) {
      return res.status(403).send("Invalid user for this refresh token");
    }

    // Issue new access token
    const accessToken = jwt.sign(
      { data: decoded.data },
      secret,
      { expiresIn: "15m" }
    );
    const newRefreshToken = jwt.sign(
      { data: decoded.data },
      secret,
      { expiresIn: "24h" }
    );

    res.status(200).send({accessToken, newRefreshToken});
  });
}




const registerInstitution = (req, res) => {
  Ajudaris.find({ id: "ajudaris" })
    .then((ajudaris) => {
      currentDate = new Date().toISOString().slice(0, 10)
      if (Date.parse(ajudaris[0].signUpDate) >= Date.parse(currentDate)) {


        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            let new_User = new User({
              email: req.body.email,
              password: hash,
              name: req.body.name,
              city: req.body.city,
              district: req.body.district,
              schools: req.body.schools,
              currentDate: ajudaris[0].currentDate,
              teachers: req.body.teachers,
              interlocutors: req.body.interlocutors,
              role: 'institution',
              verified: false
            });


            // find duplicate users
            User.find({ email: req.body.email })
              .then((user) => {
                if (user.length > 0) {
                  res.status(406).send("Duplicated User");
                } else {
                  new_User.save()
                    .then(() => {
                      res.status(200).send("Registered User");
                    })
                    .catch((err) => {
                      res.status(400).send(err);
                    })
                }
              })
          });
        });
      }
      else {
        return res.status(400).send("Error: Date exceeded limit")
      }
    })
};

const registerJury = (req, res) => {
  Ajudaris.find({ id: "ajudaris" }).then((ajudaris) => {
    if (ajudaris[0].juryCode == req.body.code) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          let new_User = new User({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            currentDate: ajudaris[0].currentDate,
            ratings: [],
            role: "jury",
            verified: false
          });


          // find duplicate users
          User.find({ email: req.body.email })
            .then((user) => {
              if (user.length > 0) {
                res.status(406).send("Duplicated User");
              } else {
                new_User.save()
                  .then(() => {
                    res.status(200).send("Registered User");
                  })
                  .catch((err) => {
                    res.status(400).send(err);
                  })
              }
            })
        });
      });
    } else {
      res.status(401).send("Not Authorized");
    }
  })
};

const registerDesigner = (req, res) => {
  Ajudaris.find({ id: "ajudaris" }).then((ajudaris) => {
    if (ajudaris[0].designerCode == req.body.code) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          let new_User = new User({
            email: req.body.email,
            password: hash,
            currentDate: ajudaris[0].currentDate,
            role: "designer",
          });


          // find duplicate users
          User.find({ email: req.body.email })
            .then((user) => {
              if (user.length > 0) {
                res.status(406).send("Duplicated User");
              } else {
                new_User.save()
                  .then(() => {
                    res.status(200).send("Registered User");
                  })
                  .catch((err) => {
                    res.status(400).send(err);
                  })
              }
            })
        });
      });
    } else {
      res.status(401).send("Not Authorized");
    }
  })
};

const registerRevisor = (req, res) => {

  Ajudaris.find({ id: "ajudaris" }).then((ajudaris) => {
    if (ajudaris[0].revisorCode == req.body.code) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          let new_User = new User({
            email: req.body.email,
            password: hash,
            currentDate: ajudaris[0].currentDate,
            role: "revisor",
            verified: false
          });


          // find duplicate users
          User.find({ email: req.body.email })
            .then((user) => {
              if (user.length > 0) {
                res.status(406).send("Duplicated User");
              } else {
                new_User.save()
                  .then(() => {
                    res.status(200).send("Registered User");
                  })
                  .catch((err) => {
                    res.status(400).send(err);
                  })
              }
            })
        });
      });
    } else {
      res.status(401).send("Not Authorized");
    }
  })
};

const registerIllustrator = (req, res) => {
  Ajudaris.find({ id: "ajudaris" }).then((ajudaris) => {
    if (ajudaris[0].illustratorCode == req.body.code) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          let new_User = new User({
            email: req.body.email,
            password: hash,
            currentDate: ajudaris[0].currentDate,
            role: "illustrator",
            verified: false
          });


          // find duplicate users
          User.find({ email: req.body.email })
            .then((user) => {
              if (user.length > 0) {
                res.status(406).send("Duplicated User");
              } else {
                new_User.save()
                  .then(() => {
                    res.status(200).send("Registered User");
                  })
                  .catch((err) => {
                    res.status(400).send(err);
                  })
              }
            })
        });
      });
    } else {
      res.status(401).send("Not Authorized");
    }
  })
};


const update = function (req, res) {     //put
  let updateData = {
    name: req.body.name,
    city: req.body.city,
    district: req.body.district,
    schools: req.body.schools,
    teachers: req.body.teachers,
    interlocutors: req.body.interlocutors,
    ratings: req.body.ratings,
  }

  User.findOneAndUpdate({ email: req.params.email }, updateData, { new: true }).then((result) => {
    res.status(200).json(result)
  }).catch((error) => {
    res.status(400).send("Error: " + error)
  })
}

const updateDate = function (req, res) {     //put for date
  User.findOneAndUpdate({ email: req.params.email }, { currentDate: req.body.date }, { new: true }).then((result) => {
    res.status(200).json(result)
  }).catch((error) => {
    res.status(400).send("Error: " + error)
  })
}




const updatePassword = function (req, res) {     //patch for password

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      let updateData = {
        password: hash,
      }
      User.findOneAndUpdate({ email: req.params.email }, updateData, { new: true }).then((result) => {
        res.status(200).json(result)
      }).catch((error) => {
        res.status(400).send("Error: " + error)
      })
    });
  });

}


const updateMarkers = function (req, res) {     //patch for markers


  let updateData = {
    markers: req.body.markers
  }
  User.findOneAndUpdate({ email: req.params.email }, updateData, { new: true }).then((result) => {
    res.status(200).json(result)
  }).catch((error) => {
    res.status(400).send("Error: " + error)
  })

}




const sendOTP = function (req, res) {     //OTP send

  User.find({ email: req.body.email })
    .then((user) => {
      if (user.length > 0) {
        OTP.find({ email: req.body.email })
          .then((otp) => {
            if (otp.length == 0) {
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: "smtp.gmail.com", // hostname
                secure: false, // TLS requires secureConnection to be false
                port: 587, // port for secure SMTP
                auth: {
                  user: process.env.MAIL,
                  pass: process.env.MAIL_PASSWORD,
                },
                tls: {
                  ciphers: 'SSLv3'
                }
              });

              let mailsubject = 'Código de uso único'

              if (req.body.use == "reset") {
                mailsubject = 'Restaurar Palavra passe'
              } else {
                mailsubject = 'Verificação de email'
              }

              let result = '';
              const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              for (let i = 0; i < 8; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
              }
              // Configure the mailoptions object
              const mailOptions = {
                from: process.env.MAIL,
                to: req.body.email,
                subject: mailsubject,
                text: 'O seu código de uso único (duração de 30 minutos) das histórias da ajudaris é: ' + result,
              };

              console.log(result)

              // Send the email
              transporter.sendMail(mailOptions, function (error) {
                if (error) {
                  console.log('Error:', error);
                } else {
                  bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(result, salt, function (err, hash) {
                      let new_OTP = new OTP({
                        email: req.body.email,
                        otp: hash,
                      });
                      new_OTP.save().then((resp) => {
                        res.status(200).json(resp)
                      }).catch((error) => {
                        res.status(400).send("Error: " + error)
                      })
                    });
                  });
                }
              });
            } else {
              res.status(400).send('OTP already sent.');
            }
          })
      }
      else {
        res.status(401).send("Not Authorized");
      }
    })
    .catch((error) => {
      res.status(400).send('Error: ' + error);
    });
}

function passwordReset(req, res) {     //password reset

  OTP.find({ email: req.body.email })
    .then((otp) => {
      if (otp.length > 0) {
        bcrypt.compare(req.body.otp, otp[0].otp)
          .then(function (result) {
            if (result) {
              bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                  let updateData = {
                    password: hash,
                    refreshToken: null
                  }
                  User.findOneAndUpdate({ email: req.body.email }, updateData, { new: true }).then((result) => {
                    OTP.findOneAndDelete({ email: req.body.email }).then((result) => {
                      if (result) {
                        res.status(200).json(result)
                      }
                    }).catch((error) => {
                      res.status(400).send("Error: " + error)
                    })
                  }).catch((error) => {
                    res.status(400).send("Error: " + error)
                  })
                });
              });

            } else {
              res.status(401).send("Not Authorized");
            }
          });
      } else {
        res.status(401).send("Not Authorized");
      }
    })
    .catch((error) => {
      res.status(400).send('Error: ' + error);
    });
}

function verifyAccount(req, res) {     //password reset
  OTP.find({ email: req.body.email })
    .then((otp) => {
      if (otp.length > 0) {
        bcrypt.compare(req.body.otp, otp[0].otp)
          .then(function (result) {
            if (result) {
              let updateData = {
                verified: true
              }
              User.findOneAndUpdate({ email: req.body.email }, updateData, { new: true }).then((result) => {
                OTP.findOneAndDelete({ email: req.body.email }).then((result) => {
                  if (result) {
                    res.status(200).json(result)
                  }
                }).catch((error) => {
                  res.status(400).send("Error: " + error)
                })
              }).catch((error) => {
                res.status(400).send("Error: " + error)
              })

            } else {
              res.status(401).send("Not Authorized");
            }
          });
      } else {
        res.status(401).send("Not Authorized");
      }
    })
    .catch((error) => {
      res.status(400).send('Error: ' + error);
    });
}




const deleteData = function (req, res) {                  //delete by id
  User.findOneAndDelete({ email: req.params.email }).then((result) => {
    res.status(200).json(result)
  }).catch((error) => {
    res.status(400).send("Error: " + error)
  })
}

const listByEmail = function (req, res) {     //to get user
  User.findOne({ email: req.params.email })
    .then((user) => {
      res.status(200).send(user)
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
}

const listAll = function (req, res) {     //to get all users
  User.find()
    .then((user) => {
      res.status(200).send(user)
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
}




const addChangeRating = function (req, res) {     //to add or change rating to submission 
  if(req.body.rating < 0 || req.body.rating > 5) {
    return res.status(400).send("Rating must be between 0 and 5");
  }
  User.findOne({ email: req.params.email })               
    .then((user) => {
      let ratingsArray = user.ratings
      let submissionRating

      if (ratingsArray.some(e => e.submissionId == req.body.id)) {
        const oldRating = ratingsArray.find(e => e.submissionId == req.body.id).rating
        submissionRating = req.body.rating - oldRating
        ratingsArray.splice(ratingsArray.findIndex(e => e.submissionId == req.body.id), 1, { submissionId: req.body.id, rating: req.body.rating })
      } else {
        submissionRating = req.body.rating
        ratingsArray.push({ submissionId: req.body.id, rating: req.body.rating })
      }
      let updateData = {
        ratings: ratingsArray
      }
      User.findOneAndUpdate({ email: req.params.email }, updateData, { new: true })
        .then((result) => {
          Submission.findOneAndUpdate({ _id: req.body.id }, { "$inc": { "rating": +submissionRating } })         //change submission rating
            .then((result) => {
              res.status(200).json(result)
            })
            .catch((error) => {
              res.status(400).send("Error: " + error)
            })
        })
        .catch((error) => {
          res.status(400).send("Error: " + error)
        })
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
}


exports.addChangeRating = addChangeRating
exports.updateDate = updateDate
exports.listByEmail = listByEmail
exports.listAll = listAll
exports.update = update
exports.updatePassword = updatePassword
exports.sendOTP = sendOTP
exports.updateMarkers = updateMarkers
exports.verifyAccount = verifyAccount
exports.passwordReset = passwordReset
exports.deleteData = deleteData
exports.login = login
exports.refreshToken = refreshToken
exports.registerInstitution = registerInstitution
exports.registerJury = registerJury
exports.registerDesigner = registerDesigner
exports.registerRevisor = registerRevisor
exports.registerIllustrator = registerIllustrator