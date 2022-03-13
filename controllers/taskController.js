//taskmanager_get,readtask_get,addtask_get,addtask_post,deletetask_delete
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports.taskmanager_get = (req,res)=>{
    res.render('taskmanager');
}

module.exports.addtask_get = (req,res) => {
    res.render('addtask');
}

const createUserTask = (details) => {
    const title = details.title;
    const description = details.desc;
    const completed = details.completed;
    const deadline = details.deadline;
    const tid = 0;
    return {title,description,completed,deadline,tid};
}

module.exports.addtask_post = async(req,res) => {
    const email = req.body.email;
    const usertask = createUserTask(req.body);
    const findres = await User.findOne({email});
    if(findres.usertasks.length==0){
        let arr = [usertask];
        try{
            let result = await User.updateOne({email},{ $set: { usertasks:arr  }},{upsert:false,multi:false});
            console.log('first data sent',result);
            res.json({success:true});
        }catch(err){
            console.log('first task push failed');
            console.log(err);
            res.json({errors : true});
        }
    }else{
        usertask.tid = findres.usertasks.length;
        let arr = findres.usertasks;
        arr.push(usertask);
        try{
            let result = await User.updateOne({email},{ $set: { usertasks:arr  }},{upsert:false,multi:false});
            console.log('pushed into exisintg arr',result);
            res.json({success:true});
        }catch(err){
            console.log('pushing into exisiting arr failed');
            console.log(err);
            res.json({errors:true});
        }
    }
}

module.exports.readtask_get = async(req,res) => {
    const tid = req.params.id;
    const email = req.params.email;
    let findres = await User.findOne({email});
    let needed = findres.usertasks.find(t=>t.tid==tid);
    res.render('tasktemplate',{needed})
}

module.exports.readtask_delete = async(req,res) => {
    const tid = req.params.id;
    const email = req.body.email;
    const findres = await User.findOne({email});
    let arr = findres.usertasks.filter(t=>t.tid!=tid);
    try{
        let result = await User.updateOne({email},{ $set: { usertasks:arr  }},{upsert:false,multi:false});
        console.log('task deleted successfully',result);
        res.json({redirect:"/taskmanager"});
    }catch(err){
        console.log('task not deleted');
        console.log(err);
        res.json({errors:true});
    }
}

module.exports.updatetask = async(req,res) =>{
    const tid = req.params.id;
    const email = req.body.email;
    const complete = req.body.complete;
    console.log(tid,email,complete);
    const findres = await User.findOne({email});
    let found = findres.usertasks.find(t=>t.tid==tid);
    console.log('before found update',found);
    found.completed = complete;
    console.log('after found update',found);
    let arr = [];
    for(let i = 0; i < findres.usertasks.length; i++){
        if(findres.usertasks[i].tid!=tid){
            arr.push(findres.usertasks[i]);
        }else{
            arr.push(found);
        }
    }
    try{
        let result = await User.updateOne({email},{ $set: { usertasks:arr  }},{upsert:false,multi:false});
        console.log('task updated successfully',result);
        res.json({redirect:"/taskmanager"});
    }catch(err){
        console.log('task not updated');
        console.log(err);
        res.json({errors:true});
    }


}