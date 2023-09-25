const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "Please enter your first name"]
    },

    lastName: {
        type: String,
        required: [true, "Please enter your last name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        unique: [true, "Email already exists"],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        trim: true,
        minlength: 8,
        maxlength: 30
    },
    passwordConfirm: {
        type: String,
        //   required: [true, "Please Confirm your password"],
        trim: true,

        minlength: 8,
        maxlength: 30
    },
    contact: {
        type: String,
        //   required: [true, "Please Confirm your password"],
        trim: true,

        minlength: 8,
        maxlength: 30
    },

    address1: {
        type: String,
        required: true,

    },
    address2: {
        type: String,
        required: true,

    },
    userRole: {
        type: String,
        required: true,
        enum: ['Supply', 'Procurement', 'Warehouse', 'Production', 'Export', 'Other']

    },


    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
    {
        timestamps: true
    }
);

//automated function
//before saving an operation hasing the password

userSchema.pre("save", async function (next) {

    try {

        if (!this.isModified("password")) {
            return next();//go to the next statement
        }
        this.password = await bcrypt.hash(this.password, 12)
        this.passwordConfirm = undefined;
    } catch (error) {
        console.log(error);

    }
});

//METHODS
//to compare the passwords for confirmation
userSchema.methods.checkPassword = async function (candidatePassword, userPassword) {

    return await bcrypt.compare(candidatePassword, userPassword);
};

//here enter token

//this user will create a random reset token for us
userSchema.methods.generatePasswordResetToken = function () {

    const resetToken = crypto.randomBytes(32).toString("hex");
    //sha256 crypto graphic algorithm
    //store it inside password reset token in the password in a hashed way
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;//in ms(10mins)
    return resetToken;
};

//this function will check if the password was changed after issuing the jwt token
userSchema.methods.passwordChangedAfterTokenIssued = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        //give me the time
        const passwordChangedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);//base 10

        return passwordChangedTime > JWTTimestamp;
        //if greater then true the password changed after issueing the token
    }
    return false;
}
module.exports = mongoose.model("User", userSchema);