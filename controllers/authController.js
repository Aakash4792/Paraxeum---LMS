const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require('bcrypt');

const handleErrors = (err) => {
    console.log(err.message,err.code);
    let errors = {email : '',password : ''};

    if(err.message==='incorrect email'){
        errors.email = 'that email is not yet registered';
    }

    if(err.message==='incorrect password'){
        errors.password = 'password is incorrect';
    }


    if(err.code===11000){
        errors.email = 'Email already exists';
        return errors;
    }
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id},'my secret string',{expiresIn : maxAge });
}


module.exports.signup_get = (req,res) => {
    res.render('signup');
}
module.exports.signup_post = async(req,res) => {
    //console.log(req.body,req.file);
    console.log("req.body",req.body);
    const {email,password,username} = req.body;
    console.log('req.file',req.file);
    try{
        let userobj;
        if(req.file)
            userobj = {email,password,username,img:{data:req.file.buffer,contentType:"image/jpg"}};
        else 
            userobj = {email,password,username};
        let user = await User.create(userobj);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly : true,maxAge : maxAge * 1000});
        res.status(200).json({user : user._id});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}
module.exports.dashboard_post = async(req,res) =>{
   console.log(req.body,req.file)
   let {email,password,username} = req.body;
   let temp = password;
   const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password,salt);
    const old = await User.findOne({email});
    let userobj = {email:old.email,username:username,password:password,tasks:old.tasks};
    if(old.img){
        userobj.img = old.img;
    }
    if(old.usertasks){
        userobj.usertasks = old.usertasks;
    }
   try{
    if(temp.length < 6){
        throw new Error('password too short');
    }
    if(req.file){
        userobj.img = {data:req.file.buffer,contentType:"image/jpg"};
    }
    User.findOneAndReplace({email},userobj).then(result=>{
        console.log('updated');
        res.status(200).json({user:result._id});
    }).catch(err=>{
        console.log('not updated');
        res.status(400).json({errors:'error'});
    })
    //userobj = {email,password,username,img:{data:req.file.buffer,contentType:"image/jpg"}};
    
    // let user = await User.create(userobj);
    // const token = createToken(user._id);
    // res.cookie('jwt',token,{httpOnly : true,maxAge : maxAge * 1000});
    // res.status(200).json({user : user._id});
}catch(err){
    console.log('not updated 2');
    res.status(400).json({errors:'invalid data'});
}
}
module.exports.login_get = (req,res) => {
    res.render('login');
}

module.exports.login_post = async(req,res) => {
    const {email,password} = req.body;
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly : true,maxAge : maxAge * 1000});
        res.status(201).json({user : user._id});
    }catch(err){
        // console.log(err);
        const errors = handleErrors(err);
        res.status(400).json({errors:errors});
    }
}

module.exports.logout_get = (req,res) => {
    res.cookie('jwt','',{maxAge : 1});
    res.redirect('/');
}