const mongoose = require('mongoose');
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

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;