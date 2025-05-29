const mongoose = require("mongoose")

const FileSchema = new mongoose.Schema({
    document: String,
    illustration: String,
})

const File = mongoose.model("File", FileSchema)

module.exports = File

