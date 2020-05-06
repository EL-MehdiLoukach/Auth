const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({    
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required:true
    },
    password : {
        type: String,
        required:true
    },
    joinedDate : {
        type : Date,
        required: true,
        default : Date.now()
    }
});
AccountSchema.methods.comparePassword = (clientPassword, password) => {
    return bcrypt.compareSync(clientPassword,password);
};

module.exports = mongoose.model('Accounts', AccountSchema);