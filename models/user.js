const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');       //this package is already present in nodejs you donot need to download a separate package for the same
const userSchema = new mongoose.Schema({
    /**One can always use 'name: String' */
    name: {
        type: String,
        required: [true, 'Please provide a name'],        //[required is true, error message incase the name is not provided]
        maxlength: [40, 'Name should be under 40 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide a email'],
        validate: [validator.isEmail, 'Please enter email in correct format' ],
        unique: true                //mongoose will automatically look into the database before saving it if the provide email already exists or not
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password should be atleast 6 characters'],
        select: false       //whenever selecting a user this field will not come in
    },
    role: {
        type: String,
        default: 'user'
    },
    photo: {
        id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }

});

//encrypt password before save - HOOKS
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});

//method to validate the password with passed on user password
userSchema.methods.isEnteredPasswordCorrect = async function(userEnteredPassword){
    return await bcrypt.compare(userEnteredPassword, this.passowrd);
}

//method for create and return jwt token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
}

//generate forgot password token(string)
userSchema.method.getForgotPasswordToken = function(){
    //generate a long and random string
    const forgotPasswordToken = crypto.randomBytes(20).toString('hex');

    //getting a hash - make sure to get a hash on backend
    this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(forgotPasswordToken)
        .digest('hex');

    //time of token
    this.forgotPasswordExpiry = Date.now() + 20*20*1000;

    return forgotPasswordToken
}

module.exports = mongoose.model('User', userSchema);