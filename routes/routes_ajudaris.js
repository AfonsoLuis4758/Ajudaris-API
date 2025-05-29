const express = require("express")
const router = express.Router()
const {body, validationResult} = require("express-validator")
const Ajudaris_controller = require("../controllers/controllers_ajudaris")
const { checkAdmin } = require('../utilities/utilities');


router.route("/")
    .get(function(req,res){
        Ajudaris_controller.list(req,res)
    })
    .put(checkAdmin,[
        body("message").isString().notEmpty().escape(),
        body("signUpDate").isString().notEmpty().escape(),
        body("submissionDate").isString().notEmpty().escape(),
        body("currentDate").isNumeric().notEmpty(),
        body("illustratorCode").isString().notEmpty().escape(),
        body("juryCode").isString().notEmpty().escape(),
        body("revisorCode").isString().notEmpty().escape(),
        body("designerCode").isString().notEmpty().escape(),
    ], function (req, res) {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            Ajudaris_controller.update(req, res)
        } else {
            res.status(400).json({
                errors: errors,
            })
        }
    }
    )
    
    router.route("/admins")
    .get(checkAdmin, function(req,res){
        Ajudaris_controller.adminList(req,res)
    })
    



module.exports = router