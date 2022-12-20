const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const accountSchema = new Schema({
        first_name: {
            type:String,
            required: true
        },
        last_name: {
            type:String,
            required: true
        },
        username: {
            type:String,
            required: true
        },
        email: {
            type:String,
            required: true
        },
        password: {
            type:String,
            required: true
        }  
},{ timestamps: true});

accountSchema.pre('save', async function(next) {
    try {
        // check method of registration
        const user = this;
        if (!user.isModified('password')) next();
        // generate salt
        const salt = await bcrypt.genSalt(10);
        // hash the password
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // replace plain text password with hashed password
        this.password = hashedPassword;
        next();
        } catch (error) {
            return next(error);
        }
});

accountSchema.methods.matchPassword = async function (password) {
     try {
       return await bcrypt.compare(password, this.password);
     } catch (error) {
       throw new Error(error);
     }
    };
const Account = mongoose.model('Account', accountSchema);
module.exports = Account;