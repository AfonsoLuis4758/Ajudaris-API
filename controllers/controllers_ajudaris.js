const Ajudaris = require("../models/models_ajudaris")


const list = function (req, res) {

    Ajudaris.find()
        .then((list) => {
            const viewableList = {
                message: list[0].message,
                signUpDate: list[0].signUpDate,
                submissionDate: list[0].submissionDate,
                currentDate: list[0].currentDate,
                dates: list[0].dates,
            }
            res.status(200).json(viewableList);
        })
        .catch((error) => {
            res.status(400).send('Error');
        });
};

const adminList = function (req, res) {
    Ajudaris.find()
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send('Error');
        });
};




const update = function (req, res) {     //put
    Ajudaris.findOne({ id: "ajudaris" })
        .then((result) => {
            if (result.currentDate != req.body.currentDate) {
                let array = result.dates

                if (!array.includes(req.body.currentDate)) {
                    array.push(req.body.currentDate)
                }

                updateData = {
                    message: req.body.message,
                    signUpDate: req.body.signUpDate,
                    submissionDate: req.body.submissionDate,
                    currentDate: req.body.currentDate,
                    illustratorCode: req.body.illustratorCode,
                    juryCode: req.body.juryCode,
                    revisorCode: req.body.revisorCode,
                    designerCode: req.body.designerCode,
                    dates: array
                }
            } else {
                updateData = {
                    message: req.body.message,
                    signUpDate: req.body.signUpDate,
                    submissionDate: req.body.submissionDate,
                    currentDate: req.body.currentDate,
                    illustratorCode: req.body.illustratorCode,
                    juryCode: req.body.juryCode,
                    revisorCode: req.body.revisorCode,
                    designerCode: req.body.designerCode,
                }
            }
            Ajudaris.findOneAndUpdate({ id: "ajudaris" }, updateData, { new: true, upsert: false })
                .then((result) => {
                    res.status(200).json(result)
                }).catch((error) => {
                    res.status(400).send("Error: " + error)
                })
        })

}


exports.list = list
exports.adminList = adminList
exports.update = update
