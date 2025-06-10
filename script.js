const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express();
const port = process.env.PORT;
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
const routes_submission = require("./routes/routes_submission")
const routes_user = require("./routes/routes_user")
const routes_ajudaris = require("./routes/routes_ajudaris")
const utilities = require("./utilities/utilities");



const auth = function (req, res, next) {
    let exceptions = [`/users/login`, `/users/institutions`, `/users/jurys`, `/users/illustrators`, `/users/revisors`,`/users/designers`, `/users/send-otp`, `/users/password-reset` , "/ajudaris/", "/users/auth/refresh"]
    if (exceptions.indexOf(req.url) < 0) {
        utilities.validateToken(req.headers.authorization, (result, email) => {
            if (result) {
                req.loggedInUser = email;
                next();
            } else {
                res.status(401).send("Invalid Token");
            }
        });
    } else {
        next();
    }
};

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
    console.log("connected")
})


app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(auth)
app.use("/submissions", routes_submission)
app.use("/users", routes_user)
app.use("/ajudaris", routes_ajudaris)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

