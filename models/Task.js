const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    email : {
        type : String,
        required : [true,'Please enter an email'],
        unique : true,
    },
    usertasks : {
        type : Array , 
        "default" : [],
    }
});

const Task = mongoose.model('task',taskSchema);

module.exports = Task;