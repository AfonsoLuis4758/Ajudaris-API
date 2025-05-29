const mongoose = require("mongoose")

const OTPSchema = new mongoose.Schema({
    email: String,
    otp: String,
    createdAt: { type: Date, expires: 1800, default: Date.now }
})

const OTP = mongoose.model("OTP", OTPSchema)

module.exports = OTP

