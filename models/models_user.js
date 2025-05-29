const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({  
    email: String,
    password: String,
    role: { type: String, default: 'user' },
    name: String,
    district: String,
    city: String,
    markers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
    currentDate: Number,
    verified: { type: Boolean, default: false },
    schools: [{
        name: String,
        address: String,
        email: String,
        phone: Number,
    }],
    teachers : [{
        name: String,
        email: String,
        phone: Number,
    }],
    interlocutors : [{
        name: String,
        email: String,
        phone: Number,
    }],
    ratings: [{
        submissionId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
        rating: Number,
    }],
    otp: String,
})

const User = mongoose.model("User", UserSchema)

module.exports = User