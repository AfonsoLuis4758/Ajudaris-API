const mongoose = require("mongoose")

const SubmissionSchema = new mongoose.Schema({
    title: String,
    state: String,
    author: String,
    date: Number,
    illustrator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    illustrated: Boolean,
    submitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    createdAt: { type: Date, default: Date.now }
})

const Submission = mongoose.model("Submission", SubmissionSchema)

module.exports = Submission

