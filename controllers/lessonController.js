//l0_get,l1_get,l2_get,l3_get,li_post
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const updateTasks = async(task,email) => {
    let user = await User.findOne({email});
    //console.log('user',user);
    if(user.tasks.length!=0){
        console.log('updatinf arr');
        let arr = user.tasks;
        arr[task] = 1;
        let result = await User.updateOne({email},{ $set: { tasks:arr  }},{upsert:false,multi:false});
        let user2 = await User.findOne({email});
        console.log('update pass',user2.password);
        // user.tasks[task] = 1;
        return result;
    }else{
        console.log('fisrt time');
        let arr = [0,0,0,0];
        arr[task] = 1;
        let result = await User.updateOne({email},{ $set: { tasks:arr  }},{upsert:false,multi:false});
        let user2 = await User.findOne({email});
        console.log('update pass',user2.password);
        // user.tasks = arr;
        return result;
    }
    //console.log('New user',user);
    //console.log('tasks',user.tasks);
    // try{
    //     let res = await user.save();
    //     console.log('update pass',user.password);
    //     if(res==user){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }catch(err){
    //     console.log(err);
    //     return false;
    // }
}

module.exports.l0_get = (req,res) =>{
    res.render('courses');
}
module.exports.l1_get = (req,res) =>{
    res.render('task1');
}
module.exports.l2_get = (req,res) =>{
    res.render('task2');
}
module.exports.l3_get = (req,res) =>{
    res.render('task3');
}
module.exports.li_post = async(req,res) => {
    let email = req.body.email;
    //let password = req.body.password;
    //console.log(email);
    let result = await updateTasks(req.params.id,email);
    console.log('updateTasks reult',result);
    res.json({done:'done'});
    //console.log('given pass',password);
    let user = await User.findOne({email});
    console.log('fnal pass',user.password);
}