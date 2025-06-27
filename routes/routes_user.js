const express = require("express")
const router = express.Router()
const {body, validationResult} = require("express-validator")
const User_controller = require("../controllers/controllers_user")
const {
    checkAdmin,
    checkJury,
    checkUser
} = require('../utilities/utilities');

router.post('/login',  function (req, res) {
    User_controller.login(req, res); 
})

// In your routes file
router.post('/auth/refresh', (req, res) => {
    User_controller.refreshToken(req, res);
});

router.post('/institutions', [
    body('email').isString().notEmpty().escape(), 
    body('password').notEmpty().escape(),
    body("name").isString().notEmpty().escape(),
    body("city").isString().notEmpty().escape(),
    body("district").isString().notEmpty().escape(),
    body("schools").isArray().notEmpty(),
    body("teachers").isArray().notEmpty(),
    body("interlocutors").isArray().notEmpty(),
],  function (req, res) {
    const errors = validationResult(req); 
    if (errors.isEmpty()) {
        User_controller.registerInstitution(req, res); 
    } else {
        res.status(404).json({errors: errors.array()})
    }
})

router.post('/jurys', [
    body('email').isString().notEmpty().escape(), 
    body('password').notEmpty().escape(),
    body("code").isString().notEmpty().escape(),
],  function (req, res) {
    const errors = validationResult(req); 
    if (errors.isEmpty()) {
        User_controller.registerJury(req, res); 
    } else {
        res.status(404).json({errors: errors.array()})
    }
})
router.post('/illustrators', [
    body('email').isString().notEmpty().escape(), 
    body('password').notEmpty().escape(),
    body("code").isString().notEmpty().escape(),
],  function (req, res) {
    const errors = validationResult(req); 
    if (errors.isEmpty()) {
        User_controller.registerIllustrator(req, res); 
    } else {
        res.status(404).json({errors: errors.array()})
    }
})

router.post('/revisors', [
    body('email').isString().notEmpty().escape(), 
    body('password').notEmpty().escape(),
    body("code").isString().notEmpty().escape(),
],  function (req, res) {
    const errors = validationResult(req); 
    if (errors.isEmpty()) {
        User_controller.registerRevisor(req, res); 
    } else {
        res.status(404).json({errors: errors.array()})
    }
})

router.post('/designers', [
    body('email').isString().notEmpty().escape(), 
    body('password').notEmpty().escape(),
    body("code").isString().notEmpty().escape(),
],  function (req, res) {
    const errors = validationResult(req); 
    if (errors.isEmpty()) {
        User_controller.registerDesigner(req, res); 
    } else {
        res.status(404).json({errors: errors.array()})
    }
})

router.route("/")
.get(checkAdmin, function(req,res){
    User_controller.listAll(req,res)
})

router.route("/:email")
.get(checkUser,function(req,res){
    User_controller.listByEmail(req,res)
})
.put(checkUser,[
    body("name").isString().optional().escape(),
    body("city").isString().optional().escape(),
    body("district").isString().optional().escape(),
    body("schools").isArray().optional(),
    body("teachers").isArray().optional(),
    body("interlocutors").isArray().optional(),
    body("ratings").isArray().optional(),
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.update(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
}
).delete(checkUser,function(req,res){
    User_controller.deleteData(req,res)
})
.patch(checkUser, function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.updatePassword(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
})


router.route("/markers/:email")
.patch(checkUser,function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.updateMarkers(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
})

router.route("/send-otp") 
.post([
    body("email").isString().notEmpty().escape(),
    body("use").isString().notEmpty().escape(),
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.sendOTP(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
})

router.route("/password-reset") 
.post([
    body("email").isString().notEmpty().escape(),
    body("password").isString().notEmpty().escape(),
    body("otp").isString().notEmpty().escape(),
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.passwordReset(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
})

router.route("/email-verification")  
.post([
    body("email").isString().notEmpty().escape(),
    body("otp").isString().notEmpty().escape(),
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.verifyAccount(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
})


router.route("/years/:email")
.patch(checkUser,[ 
    body("date").isNumeric().notEmpty(),
],function(req,res){
    User_controller.updateDate(req,res)
})



router.route("/ratings/:email")
.patch(checkUser,checkJury,function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.addChangeRating(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
})




module.exports = router