const express = require("express")
const router = express.Router()
const {body, validationResult} = require("express-validator")
const Submission_controller = require("../controllers/controllers_submission")
const {
    checkAdmin,
    checkRevisor,
    checkDesigner,
    checkIllustrator,
    checkUploader,
    checkVerification,
    checkSpecial,
    checkIdbyParams
} = require('../utilities/utilities');

router.route("/")
    .post(checkVerification,[
        body("title").isString().notEmpty().escape(),
        body("author").isString().notEmpty().escape(),
        body("submitter").isString().notEmpty(),
        body("document").isString().notEmpty(),
    ], function (req, res) {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            Submission_controller.create(req, res)
        } else {
            res.status(400).json({
                errors: errors,
            })
        }

    }
    
    ) 

    router.route("/submissions")
    .get(checkAdmin,function(req,res){
        Submission_controller.listAll(req,res)
    })

router.route("/winners")    
    .get(checkDesigner,function(req,res){
        Submission_controller.listSelected(req,res)
    })
    
router.route("/:userid")
.get(checkIdbyParams,function(req,res){
    Submission_controller.listById(req,res)
})

router.route("/illustrators/:userid")   
.get(checkIdbyParams,function(req,res){
    Submission_controller.listByIllustrator(req,res)
})


router.route("/illustrations/:id")   
.put(checkIllustrator,[
    body("illustration").isString().notEmpty(),
    body("illustrated").isBoolean().notEmpty()
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        Submission_controller.updateIllustration(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
}
)

router.route("/documents/:id")
.get(function(req,res){
    Submission_controller.getDocuments(req,res)
})

router.route("/images/:id")
.get(checkSpecial,function(req,res){
    Submission_controller.getImages(req,res)
})


router.route("/:id")
.put(checkRevisor,[
    body("title").isString().optional().escape(),
    body("state").isString().optional().escape(),
    body("author").isString().optional().escape(),
    body("illustration").isString().optional(),
    body("illustrator").isString().optional().escape(),
    body("illustrated").isBoolean().optional().escape(),
    body("document").isString().optional(),
    body("rating").isNumeric().optional().escape(),
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        Submission_controller.update(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
}
).delete(checkRevisor,function(req,res){
    Submission_controller.deleteData(req,res)
})

router.route("/institutions/:id")
.put(checkUploader,[
    body("title").isString().optional().escape(),
    body("author").isString().optional().escape(),
    body("document").isString().optional(),
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        Submission_controller.updateOwn(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
})
.delete(checkUploader,function(req,res){
    Submission_controller.deleteOwnData(req,res)
}) 



module.exports = router