const Submission = require("../models/models_submission")
const Ajudaris = require("../models/models_ajudaris");
const File = require("../models/models_files");
const User = require("../models/models_user");

/**
 * @param {*} req 
 * @param {*} res 
 */


const listAll = function (req, res) {

    const Filter = req.query.year ? { date: req.query.year } : {}; // If year is provided, use it as a filter, otherwise use an empty filter

    Submission.find(Filter).populate("submitter").sort({ "_id": -1 }).populate("illustrator")
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send('Error');
        });
};




const listById = function (req, res) {
    Submission.find({ submitter: req.params.userid }).populate("submitter")
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
};


const listSelected = function (req, res) {


    const Filter = req.query.year ? { date: req.query.year, state: "selected" } : { state: "selected" }; // If year is provided, use it as a filter, otherwise use an empty filter

    Submission.find(Filter).sort({ "_id": 1 }).populate("submitter").populate("illustrator")
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
};

const getImages = function (req, res) {
    Submission.findById(req.params.id)
        .then((submission) => {
            File.findOne({ _id: submission.fileId })
                .then((file) => {
                    res.status(200).json(file.illustration);
                })
        })
        .catch((error) => {
            res.status(400).send(error);
        });
}

const getDocuments = function (req, res) {
    Submission.findById(req.params.id)
        .then((submission) => {
            File.findOne({ _id: submission.fileId })
                .then((file) => {
                    res.status(200).json(file.document);
                })
        })
        .catch((error) => {
            res.status(400).send(error);
        });
}


const listByIllustrator = function (req, res) {
    Submission.find({ illustrator: req.params.userid }).populate("illustrator").populate("submitter")
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
};


//post
const create = function (req, res) {
    Ajudaris.find({ id: "ajudaris" })
        .then((ajudaris) => {
            currentDate = new Date().toISOString().slice(0, 10)
            if (Date.parse(ajudaris[0].submissionDate) >= Date.parse(currentDate)) {

                const new_File = new File({
                    document: req.body.document,
                    illustration: "",
                })
                new_File.save().then((result) => {
                    const new_Submission = new Submission({
                        title: req.body.title,
                        state: "submitted",
                        author: req.body.author,
                        date: ajudaris[0].currentDate,
                        submitter: req.body.submitter,
                        fileId: result._id,
                        rating: 0
                    })

                    new_Submission.save().then((result) => {
                        res.status(200).json(result)
                    }
                    ).catch((error) => {
                        res.status(400).send("Error: " + error)
                    })

                }).catch((error) => {
                    res.status(400).send("Error: " + error)
                })
            }
            else {
                return res.status(400).send("Error: Date exceeded limit")
            }
        })
}


const update = function (req, res) {     //put
    Ajudaris.find({ id: "ajudaris" })
        .then((ajudaris) => {
            currentDate = new Date().toISOString().slice(0, 10)
            if (Date.parse(ajudaris[0].submissionDate) >= Date.parse(currentDate)) {


                let updateData = {
                    title: req.body.title,
                    state: req.body.state,
                    author: req.body.author,
                    illustrator: req.body.illustrator,
                    rating: req.body.rating,
                    illustrated: req.body.illustrated,
                }


                let document = req.body.document
                let illustration = req.body.illustration

                Submission.findByIdAndUpdate(req.params.id, updateData, { new: true, upsert: false })
                    .then((result) => {
                        File.findOneAndUpdate({ _id: result.fileId }, { document: document, illustration: illustration }, { new: true })
                            .then((result) => {
                                res.status(200).json(result)
                            })
                    }).catch((error) => {
                        res.status(400).send("Error: " + error)
                    })
            }
            else {
                return res.status(400).send("Error: Date exceeded limit")
            }
        })
}


const updateOwn = function (req, res) {     //put for institution
    Ajudaris.find({ id: "ajudaris" })
        .then((ajudaris) => {
            currentDate = new Date().toISOString().slice(0, 10)
            if (Date.parse(ajudaris[0].submissionDate) >= Date.parse(currentDate)) {
                let updateData = {
                    title: req.body.title,
                    author: req.body.author,
                }

                const document = req.body.document

                Submission.findByIdAndUpdate(req.params.id, updateData, { new: true, upsert: false })
                    .then((result) => {
                        File.findOneAndUpdate({ _id: result.fileId }, { document: document }, { new: true })
                            .then((result) => {
                                res.status(200).json(result)
                            })
                    }).catch((error) => {
                        res.status(400).send("Error: " + error)
                    })
            }
            else {
                return res.status(400).send("Error: Date exceeded limit")
            }
        })
}


const updateIllustration = function (req, res) {     //put for illustration
    let updateData = {
        illustrated: req.body.illustrated,
    }

    let illustration = req.body.illustration

    Submission.findByIdAndUpdate(req.params.userid, updateData)
        .then((result) => {
            File.findOneAndUpdate({ _id: result.fileId }, { illustration: illustration }, { new: true })
                .then((result) => {
                    res.status(200).json(result)
                })
                .catch((error) => {
                    res.status(400).send("Error: " + error)
                })
        }).catch((error) => {
            res.status(400).send("Error: " + error)
        })
}

const updateIllustrator = function (req, res) {     //put for illustrator
    let updateData = {
        illustrator: req.body.illustrator,
    }
    Submission.findByIdAndUpdate(req.params.id, updateData)
        .then((result) => {
            res.status(200).json(result)
        }).catch((error) => {
            res.status(400).send("Error: " + error)
        })
}

const deleteData = function (req, res) { // delete by id
    Submission.findByIdAndDelete(req.params.id)
        .then((submissionResult) => {
            if (!submissionResult) {
                return res.status(404).send("Submission not found");
            }
            // Delete the associated file
            File.findOneAndDelete({ _id: submissionResult.fileId })
                .then(() => {
                    // Remove the rating reference from all users
                    User.updateMany(
                        {},
                        {
                            $pull: {
                                ratings: { submissionId: req.params.id },
                                markers: req.params.id
                            }
                        }
                    )
                        .then(() => {
                            res.status(200).json({ message: "Submission, file, and user ratings deleted." });
                        })
                        .catch((error) => {
                            res.status(400).send("Error removing ratings from users: " + error);
                        });
                })
                .catch((error) => {
                    res.status(400).send("Error deleting file: " + error);
                });
        })
        .catch((error) => {
            res.status(400).send("Error: " + error);
        });
}

const deleteOwnData = function (req, res) { // delete by id for institution
    Ajudaris.find({ id: "ajudaris" })
        .then((ajudaris) => {
            const currentDate = new Date().toISOString().slice(0, 10);
            if (Date.parse(ajudaris[0].submissionDate) > Date.parse(currentDate)) {
                Submission.findByIdAndDelete(req.params.id)
                    .then((submissionResult) => {
                        if (!submissionResult) {
                            return res.status(404).send("Submission not found");
                        }
                        // Delete the associated file
                        File.findOneAndDelete({ _id: submissionResult.fileId })
                            .then(() => {
                                // Remove the rating reference from all users
                                User.updateMany(
                                    {},
                                    {
                                        $pull: {
                                            ratings: { submissionId: req.params.id },
                                            markers: req.params.id
                                        }
                                    }
                                )
                                    .then(() => {
                                        res.status(200).json({ message: "Submission, file, and user ratings deleted." });
                                    })
                                    .catch((error) => {
                                        res.status(400).send("Error removing ratings from users: " + error);
                                    });
                            })
                            .catch((error) => {
                                res.status(400).send("Error deleting file: " + error);
                            });
                    })
                    .catch((error) => {
                        res.status(400).send("Error: " + error);
                    });
            } else {
                return res.status(400).send("Error: Date exceeded limit")
            }
        })

}


exports.listAll = listAll
exports.getImages = getImages
exports.getDocuments = getDocuments
exports.updateIllustration = updateIllustration
exports.updateIllustrator = updateIllustrator
exports.listById = listById
exports.listByIllustrator = listByIllustrator
exports.listSelected = listSelected
exports.create = create
exports.update = update
exports.updateOwn = updateOwn
exports.deleteData = deleteData
exports.deleteOwnData = deleteOwnData
