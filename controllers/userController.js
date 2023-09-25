const User = require("../models/userModels");
const Proc = require("../models/procurmentModels")
const Export = require("../models/exportModels")
const Supply = require("../models/supplyModels")
const Warehouse = require("../models/warehouseModel")
const Production = require("../models/productionModel")
const validator = require("validator");
const bcrypt = require("bcrypt");

const sendMail = require("../utils/email").sendMail;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");//protects our root
const { promisify } = require("util");

//To create a jwt token we should split the process into 2 parts
//1. create a function that will sign a token
//secret # of char: 30 
//to sign a token ,we should provide 3 main factors:
//Facto1: A unique field from the user: we choose always the id
//Factor 2:  JWT_SECRET
//factor4:   JWT_EXPRIES_IN
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPRIES_IN,
        });//takes a secret,id and expiry date using algorithm(RSA)
}

//we gave it the id ,secrete and one of the options(expiresIn)

//2.create a function that will send the token to the user
const createandSendToken = (user, statusCode, res, msg) => {
    const token = signToken(user._id);
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            message: msg,
            user,
        }
    })
}

//signup function
//has 2 main parameters
exports.signUp = async (req, res) => {
    try {
        let msg = "";
        //1-check if the email entered is valid
        let email = req.body.email; //every request has a body that contains the fields needed
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email." });
        }

        //2- check is the email is already in use->using mongoose via userModel
        //findOne returns the first matched document
        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            return res.status(409).json({ message: "Email is already in use." });

        }
        const checkSupply = await User.findOne({ userRole: 'Supply' });
        if (req.body.userRole === 'Supply') {
            if (checkSupply) {
                return res.status(409).json({ message: "Supply Manager already exist." });

            }


            await Supply.updateOne({}, { $push: { createdBy: User._id } });


            msg += "Added To Supply Team! "
        }
        if (req.body.userRole === "Procurement") {

            await Proc.updateOne({}, { $push: { createdBy: User._id } });
            msg += "Added To Procurement Team! "


        }


        if (req.body.userRole === "Export") {

            await Export.updateOne({}, { $push: { createdBy: User._id } });
            msg += "Added To Export Team! "


        }
        if (req.body.userRole === "Warehouse") {

            await Warehouse.updateOne({}, { $push: { createdBy: User._id } });
            msg += "Added To Warehouse Team! "

        }

        if (req.body.userRole === "Production") {

            await Production.updateOne({}, { $push: { createdBy: User._id } });
            msg += "Added To Production Team! "


        }

        //3- check if the password & password confirm are the same
        let pass = req.body.password;
        let passConfirm = req.body.passwordConfirm;
        // console.log(passConfirm);
        if (pass !== passConfirm) {
            return res.status(400).json({ message: "Password and passwordConfirm are not the same" });
        }
        //hashing the password

        // const hashedPassword = await bcrypt.hash(pass, 12)


        //if everything is okay we create the new user

        const newUser = await User.create({
            firstName: req.body.firstName,

            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            contact: req.body.contact,
            address1: req.body.address1,
            address2: req.body.address2,
            userRole: req.body.userRole,


            // password: hashedPassword,

        });

        //return res.status(201).json({ message: "User created successfuly.", data: { newUser } });
        //we can do it manually or install an npm package to validate

        //CREATE AND SEND TOKEN 
        msg += " successfuly"
        createandSendToken(newUser, 201, res, msg);

    } catch (err) {
        res.status(400).json({ message: err.message });//400:bad request
    }

};
exports.login = async (req, res) => {
    try {

        //1.check is the user email exist in the database
        const user = await User.findOne({ email: req.body.email });


        if (!user) {

            return res.status(404).json({ message: "the user doesn't exist" });

        }

        // req.session.userId = user._id;

        const userRole = user.userRole
        // console.log(userRole);

        //return res.status(200).json({ userRole })
        //2.check if the entered password is matching with the hashed stored passs
        //candidate pass: ElieHannouch (entered y the user)

        //stored password:kjsjgfskfksg stored in the db

        // const comparePasswords = await bcrypt.compare(req.body.password, user.password)
        // if (!comparePasswords) {
        //     return res.status(400).json({ message: "Incorrect credentials" });

        // }
        if (!await user.checkPassword(req.body.password, user.password)) {
            return res.status(401).json({ message: "Incorrect credentials" });

        }

        //3.if all correct,log the user in
        //  return res.status(200).json({ message: "You're loggedin! " });

        let msg = "You're loggedin! As " + userRole;
        createandSendToken(user, 200, res, msg);

    } catch (error) {
        console.log(error)

    }

};

exports.forgotPassword = async (req, res) => {
    try {
        //1.check if the user with the provided email exist
        const user = await User.findOne({ email: req.body.email });
        //const user= await User.findOne({$or:[{email:req.body.email},{phone:req.body.phone}]});

        if (!user) {
            return res.status(404).json({ message: "The user doesnt exist" })
        }


        //2.if found create the reset token to be sent via email address
        const resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });
        //after every update to remove the errors no need to valisate everytime


        //3.send passwsord via email

        //3.1 create this url

        const url = `${req.protocol}://${req.get("host")}/route/resetPassword/${resetToken}`;

        const msg = `Forgot your password? Reset it by visiting the following link:${url}`;

        //3.2 we'll be using mail track

        try {
            await sendMail({


                email: user.email,
                subject: "Your pass token valid for 10 mins",
                message: msg
            });
            res.status(200).json({ message: "The resent link was delevired to your email  successfuly" })

        } catch (error) {
            //if an erroe occured reset everything
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            res.status(500).json({ message: "An error occured while sending your token email,Please try again" });

        }
    } catch (error) {
        console.log(error);

    }
};

exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: "The token is invalid or expired.Please request a new one" });
        }

        if (req.body.password.length < 8) {
            return res.status(400).json({ message: "Password length is too short" });
        }

        if (req.body.password != req.body.passwordConfirm) {
            return res.status(400).json({ message: "Pasword not the same" });

        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordChangedAt = Date.now();

        await user.save();

        return res.status(200).json({ message: "password changed" });

    } catch (error) {
        console.log(error);
    }
}


//no need to make an endpoint to this
exports.protect = async (req, res, next) => {
    try {
        //1.check if the token owner still exist

        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {//Bearer fjgbdmaljcbf
            token = req.headers.authorization.split(" ")[1]; //take the index 1 [fjgbdmaljcbf] index 0 is[Bearer]
            //making sure the token is in in the heather
        }
        if (!token) {
            return res.status(401).json({ message: "You are not logged in,Please login to get access" })
        }
        //2. verify the token
        let decoded;
        try {
            decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            //in this case the promisify will tranform thejwt.verify to a function that returns promises
            //takes the token and gives it the secret to decode it 

        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ message: "Invalid token,Login again" });
            }
            else if (error.name === "TokenExpredError") {
                return res.status(401).json({ message: "Your session token has expired! Please login again" });

            }
        }
        // 3.check if the token owner exist
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: "The user belonging to this session no longer exist" })
        }

        //4.check if the the owner changed the password after the token is created

        if (currentUser.passwordChangedAfterTokenIssued(decoded.iat)) {
            //iat is the time that the token is created
            //exp: the time where the token is expired

            return res.status(401).json({ message: "Your password has been changed! Please login again" });

        }
        //5.if everything is ok:Add the requests(req.user=currentUser)

        req.user = currentUser;
        next();//valid user go to next step
    } catch (error) {
        console.log(error);
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: "success",
            data: {
                users,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};
