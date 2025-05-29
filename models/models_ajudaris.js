const mongoose = require("mongoose")

const AjudarisSchema = new mongoose.Schema({
    message: String,
    signUpDate: String,
    submissionDate: String,
    currentDate: Number,
    dates: Array,
    illustratorCode: String,
    juryCode: String,
    revisorCode: String,
    designerCode : String
})

const Ajudaris = mongoose.model("Ajudaris", AjudarisSchema)

module.exports = Ajudaris
