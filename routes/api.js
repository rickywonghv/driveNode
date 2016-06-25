/**
 * Created by damon on 6/20/16.
 */
var express = require('express');
var path = require('path');
var router = express.Router();
var File=require("../model/upload.js");
var DriveFile=require("../model/file.js");
var Auth=require("../model/auth.js");
var check=require("check-types");
var multer=require("multer");
var DriveDir=require("../model/directory.js");
var bytes = require('bytes');

/* API. */

//Upload Files
router.post('/upload', function(req, res, next) {
    File.FileUpload(req,res,function(data){
        res.status(data.status).json(data);
    });
});

//List Files
router.get('/file',function(req,res,next){
    DriveFile.FileList(req.param("token"),req.param("dir"),function(data){
        res.status(data.status).json(data);
    })
});

//Del File
router.delete('/file/:fileId',function(req,res,next){
    DriveFile.FileDelete(req.param("token"),req.params.fileId,function(data){
        res.status(data.status).json(data);
    })
});

//Create Directory
router.post('/dir',function(req,res,next){
    DriveDir.CreateDir(req.body.token,req.body.dir,req.body.dirname,function(data){
       res.status(data.status).json(data);
    });
});

router.get('/dir',function(req,res,next){
   DriveDir.ListDir(req.param("token"),req.param("parent"),function(data){
       res.status(data.status).json(data);
   })
});

//Download File
router.get('/download', function(req, res, next) {
    DriveFile.FileDownload(req,res);
});

//Initial
router.get('/init',function(req,res,next){
    Auth.AddUser({username:"root",password:"28911353",conpassword:"28911353",email:"damon@damonw.com",admin:true,name:"Damon Wong",space:0},function(data){
        res.json(data);
    });
});

//Add User
router.post('/user',function(req,res,next){
       var username=req.body.username;
       var password=req.body.password;
       var conpassword=req.body.conpassword;
       var email=req.body.email;
       var admin=req.body.admin;
       var name=req.body.name;
       var token=req.body.token;
       var space=req.body.space;
       if(space=="Unlimit"){
           var spacee=0;
       }else{
           var spacee=bytes(space);
       }

       Auth.AddUser({token:token,username:username,password:password,conpassword:conpassword,email:email,admin:admin,name:name,space:spacee},function(data){
           res.status(data.status).json(data);
       });
});

//Login
router.post('/login',function(req,res,next){
    if(check.not.undefined(req.body.username,req.body.password)){
        var username=req.body.username;
        var password=req.body.password;
        Auth.LoginUser({username:username,password:password},function(data){
            res.status(data.status).json(data);
        });
    }else{
        res.json({success:false,error:"Miss Param"});
    }
});

module.exports = router;
