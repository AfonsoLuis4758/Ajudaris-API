const jwt = require("jsonwebtoken");
const User = require("../models/models_user")

let secret = process.env.SECRET

const generateToken = (user_info, callback) => {
  const accessToken = jwt.sign(
    { data: user_info },
    secret,
    { expiresIn: "15m" }
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

    Submission.findById(req.params.id)
      .then((submission) => {
        if (!submission) {
          return res.status(404).send("Submission not found");
        }

        // Allow if user is admin or revisor
        if (user.role === "admin" || user.role === "revisor") {
          req.user = user;
          return next();
        }

        // Check if the logged-in user is the illustrator
        if (submission.illustrator?.toString() !== user.id.toString()) {
          return res.status(403).send("Access denied: Not the illustrator");
        }

        req.user = user;
        next();
      })
      .catch(() => res.status(500).send("Server error"));
  });
};




// Middleware to check if the user is the uploader of a submission temporary
const checkUploader = (req, res, next) => {
  const token = req.headers["authorization"];

  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }

    // Find the submission by ID from the route parameter
    Submission.findById(req.params.id)
      .then((submission) => {
        if (!submission) {
          return res.status(404).send("Submission not found");
        }

        // Allow if user is admin or revisor
        if (user.role === "admin" || user.role === "revisor") {
          req.user = user;
          return next();
        }

        // Check if the logged-in user is the submitter
        if (submission.submitter.toString() !== user.id.toString()) {
          return res.status(403).send("Access denied: Not the uploader");
        }

        req.user = user;
        next();
      })
      .catch(() => res.status(500).send("Server error"));
  });
};



const checkIdbyParams = (req, res, next) => {
  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }

    if (user._id !== req.params.userid && user.role !== "admin") {
      return res.status(403).send("Access denied: Designer only");
    }

    req.user = user; // Attach user data to the request for further use
    next();
  });
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

const checkUser = (req, res, next) => {
  const token = req.headers["authorization"];

  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }

    if (user.email !== req.params.email && user.role != "admin") {
      return res.status(403).send("Access denied: Designer only");
    }

    req.user = user; // Attach user data to the request for further use
    next();
  });
};

const checkSpecial = (req, res, next) => {
  const token = req.headers["authorization"];

  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }

    if (user.role == "institution") {
      return res.status(403).send("Access denied: Institution role not allowed");
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
exports.checkUser = checkUser;
exports.checkSpecial = checkSpecial;
exports.checkIdbyParams = checkIdbyParams;

