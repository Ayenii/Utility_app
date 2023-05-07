const mongoose = require('mongoose');

require('dotenv').config();

const conn = process.env.DATABASE_URL;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const AccountSchema = new mongoose.Schema({
    first_name: {
        type:String,
    },
    last_name: {
        type:String,
    },
    username: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    hash: String,
    salt: String,
    admin: Boolean
});

const EWAentrySchema = new mongoose.Schema({
    ewa: {
        type:String,
    },
    summary:{
        type:String,
    },
    instructions:{
        type:String,
    },
    priority:{
        type:String,
    },
    status:{
        type:String,
    },
    notes:[{
        name:String,
        note:String
    }],
    active:{
        type:Boolean,
    },
    date:{
        type:Date
    }
})


// eslint-disable-next-line no-unused-vars
const Account = connection.model('Account', AccountSchema);
// eslint-disable-next-line no-unused-vars
const EWAentry = connection.model('EWAentry', EWAentrySchema)

// Expose the connection
module.exports = connection;


