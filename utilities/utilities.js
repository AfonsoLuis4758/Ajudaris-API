const jwt = require("jsonwebtoken");
const User = require("../models/models_user")

let secret = process.env.SECRET

const generateToken = (user_info, callback) => {
  const accessToken = jwt.sign(
    { data: user_info },
    secret,
    { expiresIn: "15min" }
  );
  const refreshToken = jwt.sign(
    { data: user_info },
    secret,
    { expiresIn: "24h" }
  );
  // Optionally, save refreshToken in DB for the user here
  return callback({ accessToken, refreshToken });
};


const validateToken = (token, callback) => {
  if (!token) {
    return callback(false, null);
  }
  jwt.verify(token.replace("Bearer ", ""), secret, function (error, decoded) {
    if (error) {

      return callback(false, null);
    }

    let loggedUser = decoded.data.user;

    // Fetch the user object from the database
    User.findOne({ email: loggedUser })
    .then((user) =>{
      return callback(true, user); // Pass the full user object
    })
    .catch(()=>{
          return callback(false, null)
    })
  });
};

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
  const token = req.headers["authorization"];

  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }

    if (user.role !== "admin") {
      return res.status(403).send("Access denied: Admins only");
    }

    req.user = user; // Attach user data to the request for further use
    next();
  });
};

const checkJury = (req, res, next) => {
  const token = req.headers["authorization"];

  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }

    if (user.role !== "jury" && user.role !== "admin") {
      return res.status(403).send("Access denied: Jury only");
    }

    req.user = user; // Attach user data to the request for further use
    next();
  });
};

const checkRevisor = (req, res, next) => {
  const token = req.headers["authorization"];

  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }

    if (user.role !== "revisor" && user.role !== "admin") {
      return res.status(403).send("Access denied: revisor only");
    }

    req.user = user; // Attach user data to the request for further use
    next();
  });
};


const checkDesigner = (req, res, next) => {
  const token = req.headers["authorization"];

  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }

    if (user.role !== "designer" && user.role !== "admin") {
      return res.status(403).send("Access denied: Designer only");
    }

    req.user = user; // Attach user data to the request for further use
    next();
  });
};

const checkIllustrator = (req, res, next) => {
  const token = req.headers["authorization"];

  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }

    if (user.role !== "illustrator" && user.role !== "admin") {
      return res.status(403).send("Access denied: Designer only");
    }

    req.user = user; // Attach user data to the request for further use
    next();
  });
};

// Middleware to check if the user is the uploader of a submission temporary
const checkUploader = (req, res, next) => {
  const token = req.headers["authorization"];

  // Validate the token
  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }
        if (req.params.userid != user._id && user.role !== "admin"){
          return res.status(403).send("Access denied: Not the uploader");
        }

        req.user = user; // Attach user data to the request for further use
        
        next();
      })
};
const checkVerification = (req, res, next) => {
  const token = req.headers["authorization"];

  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }

    if (user.verified !== true && user.role != "admin") {
      return res.status(403).send("Access denied: Designer only");
    }

    req.user = user; // Attach user data to the request for further use
    next();
  });
};


exports.checkUploader = checkUploader;
exports.checkVerification = checkVerification;
exports.checkJury = checkJury;
exports.checkIllustrator = checkIllustrator
exports.checkRevisor = checkRevisor;
exports.checkDesigner = checkDesigner;
exports.generateToken = generateToken;
exports.validateToken = validateToken;
exports.checkAdmin = checkAdmin;

